import React, { FormEvent, useEffect, useState, useRef } from 'react';
import * as C from './tutorial.styles.ts';
import * as Videos from '../services/videos.ts'; 
import { Video } from '../types/Video.ts';
import { VideoItem } from '../componentes/VideoItem/index.tsx';
import { listAll, ref } from 'firebase/storage';
import { storage } from '../libs/firebase.ts';
import { useAuth } from '../contexto/useAuth.jsx';
import { CircularProgress } from '@material-ui/core';

function Tutorial() {
    const { userLoggedIn, userIsAdmin } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [showNameError, setShowNameError] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getVideos = async () => {
            setLoading(true);
            setVideos(await Videos.getAll());
            setLoading(false);
        }
        getVideos();
    }, []);

    // Função para excluir um video
    const handleDeleteVideo = async (videoName: string) => {
        if (window.confirm("Tem certeza que deseja excluir esse vídeo?")) {
            try {
                await Videos.deleteVideo(videoName);
                const updatedVideos = videos.filter(video => video.name !== videoName);
                setVideos(updatedVideos);
            } catch (error) {
                console.error("Erro ao excluir o vídeo:", error);
            }
        }
        if(videoFile){
            
        }
    };

    // Função para verificar se o nome do video já está em uso
    const checkFileNameExists = async (fileName: string) => {
        const videoPasta = ref(storage, "videosTutorial");
        const videoList = await listAll(videoPasta);
        const existingNames = videoList.items.map(item => item.name.split('.')[0]);
        return existingNames.includes(fileName);
    };

    // Evento de envio do formulário
    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get('video') as File;
        const fileName = formData.get('fileName') as string;
        console.log('filename: ' + JSON.stringify(formData));

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
            let result = await Videos.insert(file, fileName, description);
            setUploading(false);

            if (result instanceof Error) {
                alert(`${result.name} - ${result.message}`);
            } else {
                let newVideoList = [...videos];
                newVideoList.push(result);
                setVideos(newVideoList);
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
                <C.Header>Tutoriais da Gabi</C.Header>

                {/* Area de upload  */}
                {userLoggedIn && userIsAdmin &&
                    <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
                        <C.UploadInput
                            type='file'
                            name='video'
                            onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                            ref={fileInputRef}
                        />
                        <C.UploadTitle
                            type='input'
                            name='fileName' 
                            placeholder='Título do vídeo...' 
                            value={fileName} 
                            onChange={(e) => setFileName(e.target.value)} // Adicionando onChange para atualizar o estado do título
                        />
                        <C.UploadDescription 
                            name='description' 
                            placeholder='Descrição do tutorial (máximo de 150 caracteres)' 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            maxLength={150} 
                            rows={4} 
                            cols={50} 
                        />
                        <C.UploadButton type='submit' name='Enviar'>Enviar</C.UploadButton>
                        {uploading && "Enviando..."}
                        {showNameError && <div style={{ color: 'red' }}>{fileName.trim() === '' ? 'Por favor, digite uma descrição para o tutorial.' : 'Esse nome já está em uso. Por favor, escolha outro nome.'}</div>}
                    </C.UploadForm>
                }

                {/* Vídeos */}             
                {videos.map((video, index) => (
                    <VideoItem 
                        key={index} 
                        url={video.url} 
                        name={video.name} 
                        description={video.description} 
                        onDelete={handleDeleteVideo} 
                        isAdmin = {userIsAdmin}
                        isLoggedIn = {userLoggedIn}
                    />
                ))}
                
                {loading &&
                    <C.ScreenWarnings>
                        <div className="emoji">🤚</div>
                        <div>Carregando...</div>
                        <div className="loading-indicator">
                            <CircularProgress />
                        </div>
                    </C.ScreenWarnings>
                }

                {/* {videos && videos.length > 0 && (
                    <C.PhotoList>
                        {videos.map((item, index) => (
                            <VideoItem key={index} url={item.url} name={item.name} onDelete={handleDeleteVideo} />
                        ))}
                    </C.PhotoList>
                )} */}

                {!loading && videos.length === 0 &&
                    <C.ScreenWarnings>
                        <div className="emoji">😞</div>
                        <div>Não há vídeos tutoriais cadastradas.</div>
                    </C.ScreenWarnings>
                }
            </C.Area>
        </C.Container>
    );
}

export default Tutorial;