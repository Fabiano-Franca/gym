import axios, { AxiosError, AxiosInstance } from "axios";
import { AppError } from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";

type SignOut = () => void

//Tipo da fila de armanzenamento de requisições
type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

export const api = axios.create({
    baseURL: 'http://10.139.76.46:3333'
}) as APIInstanceProps;

//Fila para armanezar as requisições
let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
    //Trocar erro por requestError para deixar claro que esse é o erro da requisição.
    const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
        //Verificar se é uma requisição não autorizada | status === 401
        if(requestError?.response.status === 401){
            if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
                const { refresh_token } = await storageAuthTokenGet();

                if(!refresh_token) {
                    signOut();
                    return Promise.reject(requestError);
                }
                
                //Recupera as informações da requisição não autorizada e com token para renovar
                const originalRequestConfig = requestError.config;

                //Se entrou nesse método é pq o token precisa ser renovado.
                //A requisição que entrar primeiro não ficará na fila porque isRefreshing estará como false, não entrando no if abaixo.
                if(isRefreshing) {
                    return new Promise((resolve, reject) => {
                        //Adiciona a requisição na fila
                        failedQueue.push({
                            onSuccess: (token: string) => {
                                //Pega o token para processar a nova requisição com o token. 
                                //O token que for passado nesse método é o token renovado. 
                                //Com ele vamos substituir o token inválido pelo token válido.
                                originalRequestConfig.headers = {'Authorization': `Bearer ${token}`};
                                //Faz a requisição novamente após substituir o token inválido pelo válido.
                                resolve(api(originalRequestConfig));
                            },
                            onFailure: (error: AxiosError) => {
                                //Se der erro rejeitamos a requisição.
                                reject(error)
                            },
                        })
                    });
                }

                //A próxima requisição que precisará ter seu token renovado receberá isRefreshing como true.
                //Entrando na fila
                isRefreshing = true;

                return new Promise(async (resolve, reject) => {
                    try {
                        const { data } = await api.post('/sessions/refresh_token', { refresh_token });
                        //console.log("TOKEN ATUALIZADO => ", data)

                        //armazena o novo token no dispositivo do usuário
                        await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });
                        
                        //Verifica se está enviando algum dado junto com a requisição
                        if(originalRequestConfig.data) {
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
                        }

                        //Atualiza o cabeçalho da requisição atual
                        originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
                        //Atualiza o cabeçalho das próximas requisições
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                        //Percorre a fila de requisições e processa as requisições da fila passando o token atualizado.
                        failedQueue.forEach(request => {
                            request.onSuccess(data.token);
                        })

                        console.log("TOKEN ATUALIZADO")

                    } catch (error: any) {
                        //Se falar, pecorremos todos os elementos da fila e informamos que falhou
                        failedQueue.forEach(request => {
                            request.onFailure(error);
                        });

                        signOut()
                        reject(error);
                        
                    } finally {
                        //Passou por aqui, o token foi renovado. Logo, não precisa entrar na fila de requisição
                        isRefreshing = false;
                        //Linpa a fila.
                        failedQueue = [];
                    }
                });

            }

            //Desloga usuário
            signOut(); 
        }
        
        //Verificar se é um erro tratado ou não. Só chegará até aqui se for um token válido.
        if (requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(requestError);
        }
    });

    return () => {
        //Retira da memória o interceptador
        api.interceptors.response.eject(interceptTokenManager);
    };
};

