const express = require('express');
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');
const PORT = 3000;

app.use('/flight',createProxyMiddleware({
    target: 'http://flight-information:3002',
    changeOrigin:true
}));

app.use('/airlines',createProxyMiddleware({
    target: 'http://airlines-information:3001',
    changeOrigin:true
}));

app.use('/passengers',createProxyMiddleware({
    target: 'http://passenger-information:3003',
    changeOrigin:true
}));

app.listen(PORT,()=>{
    console.log(`API Gateway running on port ${PORT}`);
});

