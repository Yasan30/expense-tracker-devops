const test=require('node:test');
const assert=require('node:assert/strict');
const app=require('../app');
test('health endpoint returns ok',async()=>{const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{const response=await fetch(`http://127.0.0.1:${server.address().port}/api/health`);assert.equal(response.status,200);assert.deepEqual(await response.json(),{status:'ok'});}finally{await new Promise(r=>server.close(r));}});
test('rejects an invalid expense',async()=>{const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));try{const response=await fetch(`http://127.0.0.1:${server.address().port}/api/expenses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'',category:'Food',amount:-5})});assert.equal(response.status,400);assert.ok((await response.json()).error);}finally{await new Promise(r=>server.close(r));}});
