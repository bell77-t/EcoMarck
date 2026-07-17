import { request, notify } from './app.js';
const form=document.querySelector('#productForm');
const id=new URLSearchParams(location.search).get('id');
function fill(data){for(const [key,value] of Object.entries(data)){const input=form.elements[key];if(input)input.value=value??'';}}
document.addEventListener('DOMContentLoaded',async()=>{if(!form)return;if(!localStorage.getItem('ecoToken'))return location.href='login.html';if(id){document.querySelector('#formTitle').textContent='Editar producto';document.querySelector('#saveText').textContent='Guardar cambios';try{fill(await request(`/products/${id}`));}catch(e){notify(e.message,'danger');}}form.addEventListener('submit',async(e)=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));try{await request(id?`/products/${id}`:'/products',{method:id?'PUT':'POST',body:JSON.stringify(data)});notify(id?'Cambios guardados.':'Producto publicado.');location.href='catalog.html';}catch(error){notify(error.message,'danger');}});});
