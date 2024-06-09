// Galeria.tsx
import React, { FormEvent, useEffect, useState, useRef } from 'react';
import * as C from './galeria.styles.ts';
import * as Photos from '../services/photos.ts'; 
import { Photo } from '../types/Photo.ts';
import { PhotoItem } from '../componentes/PhotoItem/index.tsx';
import { listAll, ref } from 'firebase/storage';
import { storage } from '../libs/firebase.ts';
import { useAuth } from '../contexto/useAuth.jsx';
import { CircularProgress } from '@material-ui/core';

function Galeria() {
    const { userLoggedIn, userIsAdmin } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [showNameError, setShowNameError] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getPhotos = async () => {
            setLoading(true);
            setPhotos(await Photos.getAll());
            setLoading(false);
            
        }
        getPhotos();
    }, []);

    // Função para excluir uma foto
    const handleDeletePhoto = async (photoName: string) => {
        if (window.confirm("Tem certeza que deseja excluir essa foto?")) {
            try {
                await Photos.deletePhoto(photoName);
                const updatedPhotos = photos.filter(photo => photo.name !== photoName);
                setPhotos(updatedPhotos);
            } catch (error) {
                console.error("Erro ao excluir a foto:", error);
            }
        }
        if (imageFile) {
        }
    };

    // Função para verificar se o nome da foto já está em uso
    const checkFileNameExists = async (fileName: string) => {
        const imagesPasta = ref(storage, "imagensGaleria");
        const photoList = await listAll(imagesPasta);
        const existingNames = photoList.items.map(item => item.name.split('.')[0]);
        return existingNames.includes(fileName);
    };

    // Evento de envio do formulário
    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;
        const fileName = formData.get('fileName') as string;

        // Verifica se o nome está vazio
        if (fileName.trim() === '') {
            setShowNameError(true);
            return;
        } else {
            setShowNameError(false);
        }

        if (file && file.size > 0 && fileName.trim() !== '') {
            const nameExists = await checkFileNameExists(fileName);
            if (nameExists) {
                setShowNameError(true);
                return;
            } else {
                setShowNameError(false); 
            }

            setUploading(true);
            let result = await Photos.insert(file, fileName);
            setUploading(false);

            if (result instanceof Error) {
                alert(`${result.name} - ${result.message}`);
            } else {
                let newPhotoList = [...photos];
                newPhotoList.push(result);
                setPhotos(newPhotoList);
                setFileName('');

                // Limpar o campo de entrada de arquivo
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } else {
            setShowNameError(true); // Exibe a mensagem de erro se o campo de nome estiver vazio
        }
    };

    return (
        <C.Container>
            <C.Area>
                <C.Header>Galeria de Fotos</C.Header>

                {/* Area de upload  */}
                {userLoggedIn && userIsAdmin &&
                    <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
                        <input
                            type='file'
                            name='image'
                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            ref={fileInputRef}
                        />
                        <input type='text' name='fileName' placeholder='Nome do arquivo' value={fileName} onChange={(e) => setFileName(e.target.value)} />
                        <input type='submit' name='Enviar' />
                        {uploading && "Enviando..."}
                        {showNameError && <div style={{ color: 'red' }}>{fileName.trim() === '' ? 'Por favor, digite um nome para a foto.' : 'Esse nome já está em uso. Por favor, escolha outro nome.'}</div>}
                    </C.UploadForm>
                }
            
                {!userLoggedIn &&
                    <C.ScreenWarnings>
                        <div>Acesse sua conta para visualizar as fotos</div>
                    </C.ScreenWarnings>
                }

                {userLoggedIn && loading &&
                    <C.ScreenWarnings>
                        <div className="emoji">🤚</div>
                        <div>Carregando...</div>
                        <div className="loading-indicator">
                            <CircularProgress />
                        </div>
                    </C.ScreenWarnings>
                }

                {userLoggedIn && !loading && photos.length > 0 &&
                    <C.PhotoList>
                        {photos.map((item, index) => (
                            <PhotoItem 
                                key={index} url={item.url} 
                                name={item.name} 
                                onDelete={handleDeletePhoto}                                 
                                isAdmin={userIsAdmin}
                                isLoggedIn={userLoggedIn}
                            />
                        ))}
                    </C.PhotoList>
                }

                {userLoggedIn && !loading && photos.length === 0 &&
                    <C.ScreenWarnings>
                        <div className="emoji">😞</div>
                        <div>Não há fotos cadastradas.</div>
                    </C.ScreenWarnings>
                }
            </C.Area>
        </C.Container>
    );
}

export default Galeria;
