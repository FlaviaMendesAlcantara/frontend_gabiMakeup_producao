import React from 'react';
import * as C from './styles.ts';

type Props = {
    url: string;
    name: string;
    description: string;
    onDelete: (name: string) => void;
    isAdmin: boolean;
    isLoggedIn: boolean;
}

export const VideoItem = ({ url, name,description, onDelete ,isAdmin, isLoggedIn } : Props) => {
    const handleDelete = () => {
        onDelete(name); 
    };

    return (
            // <C.Container>
            //     <video controls>
            //         <source src={url} type="video/mp4" />
            //         Your browser does not support the video tag.
            //     </video>
            //     <div>{name}</div>
            //     <C.DeleteButton onClick={handleDelete}>Excluir</C.DeleteButton> {/* Botão de exclusão */}
            // </C.Container>

            <C.VideoWrapper>
                <C.VideoTitle>{name}</C.VideoTitle>
                <C.VideoDescription>{description}</C.VideoDescription>
                <C.Video controls>
                    <source src={url} type="video/mp4" />
                    Seu navegador não suporta vídeos HTML5.
                </C.Video>
                {isAdmin && isLoggedIn && <C.DeleteButton onClick={handleDelete}>Excluir</C.DeleteButton>}
            </C.VideoWrapper>
        );
}