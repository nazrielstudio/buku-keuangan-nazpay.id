import { put, list, del } from '@vercel/blob';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'change-this-secret');
const PIN = process.env.ADMIN_PIN || 'nazpayid123';
const key = 'nazpay-data.json';

const seed = {transactions:[], testimonials:[], partners:[], settings:{brand:'NAZPAY', contact:'Kontak resmi NAZPAY'}};
async function load(){ try { const r=await list({prefix:'data/'}); const x=r.blobs.find(b=>b.pathname.endsWith(key)); if(!x) return seed; const res=await fetch(x.url,{cache:'no-store'}); return await res.json(); } catch { return seed; } }
async function save(data){ await put('data/'+key, JSON.stringify(data), {access:'public', addRandomSuffix:false, contentType:'application/json', allowOverwrite:true}); return data; }
async function auth(req){ const c=req.headers.get('cookie')||''; const m=c.match(/nazpay_session=([^;]+)/); if(!m) return false; try{ await jwtVerify(m[1],secret); return true; }catch{return false;} }
function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json',...headers}})}
export default async function handler(req){
 const u=new URL(req.url); const path=u.pathname.replace(/^\/api\/?/,'');
 if(req.method==='GET' && path==='public') { const d=await load(); return json({...d,transactions:d.transactions.map(({proof,...x})=>x)}); }
 if(req.method==='POST' && path==='login'){ const body=await req.json(); if(body.pin!==PIN) return json({ok:false,error:'PIN salah'},401); const token=await new SignJWT({admin:true}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('12h').sign(secret); return json({ok:true},{'set-cookie':`nazpay_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=43200`}); }
 if(req.method==='POST' && path==='logout') return json({ok:true},{'set-cookie':'nazpay_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'});
 if(!(await auth(req))) return json({error:'Unauthorized'},401);
 if(req.method==='GET' && path==='data') return json(await load());
 if(req.method==='POST' && path==='data'){ const body=await req.json(); return json(await save(body)); }
 if(req.method==='POST' && path==='upload'){ const form=await req.formData(); const file=form.get('file'); if(!file || typeof file.arrayBuffer!=='function') return json({error:'File tidak ditemukan'},400); if(file.size>8*1024*1024) return json({error:'Maksimal 8 MB'},400); const safe=(file.name||'proof').replace(/[^a-zA-Z0-9._-]/g,'_'); const b=await put(`proofs/${Date.now()}-${safe}`,file,{access:'public'}); return json({url:b.url,name:safe}); }
 return json({error:'Not found'},404);
}
