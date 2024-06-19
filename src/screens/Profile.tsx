import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/fabiano-franca.png')

    //Inicializa o toast
    const toast = useToast();

    async function handleUserPhotoSelect() {
        setIsLoading(true);
        try {
            //Abre a galeria de imagens
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4,4],
                allowsEditing: true,
            });
    
            //console.log(photoSelected);
    
            if(photoSelected.canceled){
                return;
            }

            if(photoSelected.assets[0].uri){
                const { photoInfo }: any = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                //console.log(photoInfo);
                //console.log((photoInfo.size / 1024 /1024));
                
                if(photoInfo.size && (photoInfo.size / 1024 /1024) > 5){
                    return toast.show({
                        title: 'Essa imagem é muito grande. Escolha uma de até 3MB.',
                        placement: 'top',
                        bgColor: 'red.500'
                    });
                }

                setUserPhoto(photoSelected.assets[0].uri);
            }
    
        } catch (error) {
            
        } finally {
            setIsLoading(false);
        }
    }

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
                            source={{ uri: userPhoto}}
                            alt="Foto do usuário"
                            size={PHOTO_SIZE}
                        />
                    }
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
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