import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { useEffect, useState } from 'react';
import * as consoleService from '../services/consoleService';

export default function OwnerGuard() {
    const { consoleId } = useParams();
    const { userId } = useAuthContext();
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        consoleService.getOne(consoleId)
            .then(console => {
                setIsOwner(console._ownerId === userId);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, [consoleId, userId]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isOwner) {
        return <Navigate to={`/consoles/${consoleId}`} replace />;
    }

    return <Outlet />;
} 