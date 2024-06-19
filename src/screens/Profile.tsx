import { Center, ScrollView, VStack, Skeleton, Text, Heading } from "native-base";

import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setIsLoading] = useState(false);

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                        <Skeleton 
                            w={PHOTO_SIZE}
                            h={PHOTO_SIZE}
                            rounded={"full"}
                            startColor={"gray.500"}
                            endColor={"gray.400"}
    
                        />

                        :
                        <UserPhoto 
                            source={{ uri: 'https://github.com/fabiano-franca.png'}}
                            alt="Foto do usuário"
                            size={PHOTO_SIZE}
                        />
                    }
                    <TouchableOpacity>
                        <Text color={"green.500"} fontWeight={"bold"} fontSize={"md"} mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input 
                        bg={"gray.600"}
                        placeholder="Nome"
                    />

                    <Input 
                        bg={"gray.600"}
                        value="fabianofranca.ti@gmail.com"
                        isDisabled
                    />
                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color={"gray.200"} fontSize={"md"} mb={2} alignSelf={"flex-start"} mt={12}>
                        Alterar senha
                    </Heading>

                    <Input 
                        bg={"gray.600"}
                        placeholder="Senha antiga"
                        secureTextEntry
                    />

                    <Input 
                        bg={"gray.600"}
                        placeholder="Nova senha"
                        secureTextEntry
                    />

                    <Input 
                        bg={"gray.600"}
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                    />

                    <Button 
                        title="Atualizar"
                        mt={4}
                    />
                </VStack>
            </ScrollView>
        </VStack>
    );
}