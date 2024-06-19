import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { Center, Image, VStack, Text, Heading, ScrollView } from "native-base";

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

export function SignUp(){
 
    const { control, handleSubmit } = useForm<FormDataProps>();

    const navigation = useNavigation();


    function handleSignUp({ name, email, password, password_confirm }: FormDataProps){
        console.log(name, email, password, password_confirm);
    }

    function handleGoBack() {
        navigation.goBack();
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
                                onChange={onChange}
                                value={value}
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
                                onChange={onChange}
                                value={value}
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
                                onChange={onChange}
                                value={value}
                            />
                        )}
                    />


                    <Button 
                        title="Criar e Acessar" 
                        onPress={handleSubmit(handleSignUp)}
                    />

                </Center>
                
                <Button 
                    title="voltar para o login" 
                    variant="outline" 
                    mt={24}
                    onPress={handleGoBack}
                />
            </VStack>
        </ScrollView>
    );
}