import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Center, Image, VStack, Text, Heading, ScrollView , useToast} from "native-base";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object().shape({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere.')
});

export function SignUp(){
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();
    
    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({ name, email, password, password_confirm }: FormDataProps){
        try {
            
            setIsLoading(true);

            const response = await api.post('/users', { name, email, password });
            await signIn(email, password);

          } catch (error) {

            setIsLoading(false);

            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. tente novamente mais tarde.';
        
            toast.show({
              title,
              placement: 'top',
              bgColor: 'red.500'
            });
          }
    }


    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} bgColor={"gray.700"} px={10}>
                <Image 
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinandoplano de fundo"
                    resizeMode="cover"
                    position="absolute"
                />
                
                <Center my={24}>
                    <LogoSvg />

                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Crie sua conta
                    </Heading>

                    <Controller 
                        control={control}
                        name='name'
                        render={({ field: { onChange, value} }) => (
                            <Input 
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='email'
                        render={({ field: { onChange, value} }) => (
                            <Input 
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />
                    
                    <Controller 
                        control={control}
                        name='password'
                        render={({ field: { onChange, value} }) => (
                            <Input 
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password_confirm'
                        render={({ field: { onChange, value} }) => (
                            <Input 
                                placeholder="Confirme senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />


                    <Button 
                        title="Criar e Acessar" 
                        onPress={handleSubmit(handleSignUp)}
                        isLoading={isLoading}
                    />

                </Center>
                
                <Button 
                    title="voltar para o login" 
                    variant="outline" 
                    mt={16}
                    onPress={handleGoBack}
                />
            </VStack>
        </ScrollView>
    );
}

function setIsLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
