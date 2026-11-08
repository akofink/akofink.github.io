import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const host=process.env.HOST||'127.0.0.1';
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.svg':'image/svg+xml'};
await stat(root).catch(()=>{throw new Error('Run npm run build first.');});
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  let path=resolve(root,'.'+pathname);
  if(path!==resolve(root)&&!path.startsWith(resolve(root)+sep)){res.writeHead(403);return res.end('Forbidden');}
  if((await stat(path)).isDirectory()) path=resolve(path,'index.html');
  const data=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.listen(port,host,()=>console.log(`Exhibition ready: http://${host}:${port} (PID ${process.pid})`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
