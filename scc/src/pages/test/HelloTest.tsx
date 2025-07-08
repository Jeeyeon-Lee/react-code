import React, { useEffect, useState } from 'react';
import { fetchHello } from '@api/test/helloApi';

const HelloTest = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHello().then(setMessage).catch(console.error);
    }, []);

    return <div>✅ 서버 응답: {message}</div>;
};

export default HelloTest;
