import { Center, Image, VStack, Text, Heading, ScrollView, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormDataProps = {
    email: string;
    password: string;
}

const signUpSchema = yup.object().shape({
    email: yup.string().required('Informe o e-mail.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
});

export function SignIn(){
    const { signIn } = useAuth();
    const toast = useToast();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount() {
        navigation.navigate('signUp');
    }

    async function handleSignIn({ email, password }: FormDataProps){
        try {
            setIsLoading(true);
            await signIn(email, password);
          } catch (error) {
            const isAppError = error instanceof AppError;   
            
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.';

            setIsLoading(false);

            toast.show({
              title,
              placement: 'top',
              bgColor: 'red.500'
            })
          }
    }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack bgColor="gray.700" px={10}>
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
                    Acesse sua conta
                </Heading>

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

                <Button 
                    title="Acessar" 
                    onPress={handleSubmit(handleSignIn)}
                />

                <Center mt={24}>
                    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body" >
                        Ainda não tem acesso?
                    </Text>
                </Center>

                <Button 
                    title="Criar conta" 
                    variant="outline"
                    onPress={handleNewAccount}
                />
            </Center>
            </VStack>
        </ScrollView>
    );
}