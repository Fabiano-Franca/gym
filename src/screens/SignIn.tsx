import { Center, Image, VStack, Text, Heading, ScrollView } from "native-base";

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

export function SignIn(){

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount() {
        navigation.navigate('signUp');
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

                <Input 
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input 
                    placeholder="Senha"
                    secureTextEntry
                />

                <Button title="Acessar" />

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
        // <VStack flex={1} bgColor="gray.700" px={10}>
        //     <Image 
        //         source={BackgroundImg}
        //         defaultSource={BackgroundImg}
        //         alt="Pessoas treinandoplano de fundo"
        //         resizeMode="cover"
        //         position="absolute"
        //     />
        //     <Center my={24}>
        //         <LogoSvg />

        //         <Text color="gray.100" fontSize="sm">
        //             Treine sua mente e o seu corpo
        //         </Text>
        //     </Center>
            // <Center>
            //     <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            //         Acesse sua conta
            //     </Heading>

            //     <Input 
            //         placeholder="E-mail"
            //         keyboardType="email-address"
            //         autoCapitalize="none"
            //     />
            //     <Input 
            //         placeholder="Senha"
            //         secureTextEntry
            //     />

            //     <Button title="Acessar" />

            //     <Center mt={24}>
            //         <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body" >
            //             Ainda não tem acesso?
            //         </Text>
            //     </Center>

            //     <Button 
            //         title="Criar conta" 
            //         variant="outline"
            //         onPress={handleNewAccount}
            //     />
            // </Center>
        // </VStack>
    );
}