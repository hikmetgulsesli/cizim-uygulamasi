var v=Object.defineProperty;var m=(o,e,t)=>e in o?v(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var n=(o,e,t)=>m(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();class x{constructor(e,t={}){n(this,"canvas");n(this,"ctx");n(this,"dpr");n(this,"rectCache",null);n(this,"resizeObserver",null);n(this,"rafId",null);n(this,"lastFrameTime",0);n(this,"targetFrameTime",1e3/60);n(this,"eventHandlers",new Map);n(this,"isDrawing",!1);n(this,"lastPoint",null);n(this,"pointsBuffer",[]);n(this,"smoothingEnabled",!0);this.canvas=e;const r=e.getContext("2d",{alpha:!1,desynchronized:!0});if(!r)throw new Error("Canvas: Could not get 2D context");this.ctx=r,this.dpr=t.enableHighDPI!==!1&&window.devicePixelRatio||1,this.setupCanvas(t),this.setupEventListeners(),this.setupResizeHandling()}setupCanvas(e){const t=this.canvas.parentElement,r=e.width||(t?t.clientWidth:800),s=e.height||(t?t.clientHeight:600);this.setSize(r,s),this.ctx.lineCap=e.lineCap||"round",this.ctx.lineJoin=e.lineJoin||"round",e.backgroundColor!=="transparent"&&this.clear(e.backgroundColor||"#ffffff")}setupEventListeners(){this.canvas.addEventListener("pointerdown",this.handlePointerDown.bind(this),{passive:!1}),this.canvas.addEventListener("pointermove",this.handlePointerMove.bind(this),{passive:!1}),this.canvas.addEventListener("pointerup",this.handlePointerUp.bind(this),{passive:!1}),this.canvas.addEventListener("pointerleave",this.handlePointerUp.bind(this),{passive:!1}),this.canvas.addEventListener("pointercancel",this.handlePointerUp.bind(this),{passive:!1}),this.canvas.addEventListener("touchstart",e=>e.preventDefault(),{passive:!1}),this.canvas.addEventListener("touchmove",e=>e.preventDefault(),{passive:!1}),this.canvas.addEventListener("touchend",e=>e.preventDefault(),{passive:!1}),window.addEventListener("scroll",()=>{this.rectCache=null},{passive:!0})}setupResizeHandling(){typeof ResizeObserver<"u"&&this.canvas.parentElement?(this.resizeObserver=new ResizeObserver(e=>{for(const t of e){const{width:r,height:s}=t.contentRect;this.setSize(r,s),this.emit("resize",{type:"resize",x:0,y:0,rawX:0,rawY:0,pressure:0,pointerId:0,pointerType:"",isPrimary:!1,buttons:0,originalEvent:new PointerEvent("resize")})}}),this.resizeObserver.observe(this.canvas.parentElement)):window.addEventListener("resize",()=>{this.rectCache=null;const e=this.canvas.parentElement;e&&this.setSize(e.clientWidth,e.clientHeight)})}getPointerPos(e){this.rectCache||(this.rectCache=this.canvas.getBoundingClientRect());const t=this.rectCache;return{x:(e.clientX-t.left)*(this.canvas.width/t.width/this.dpr),y:(e.clientY-t.top)*(this.canvas.height/t.height/this.dpr)}}handlePointerDown(e){e.preventDefault(),this.isDrawing=!0,this.canvas.setPointerCapture(e.pointerId);const t=this.getPointerPos(e);this.lastPoint=t,this.pointsBuffer=[t];const r=this.createCanvasEvent("pointerdown",t,e);this.emit("pointerdown",r)}handlePointerMove(e){if(!this.isDrawing){this.rectCache=null;return}e.preventDefault();const t=this.getPointerPos(e);this.pointsBuffer.push(t),this.rafId===null&&(this.rafId=requestAnimationFrame(s=>{this.rafId=null,this.renderSmoothLine(s)}));const r=this.createCanvasEvent("pointermove",t,e);this.emit("pointermove",r)}handlePointerUp(e){if(!this.isDrawing)return;e.preventDefault(),this.isDrawing=!1,this.canvas.releasePointerCapture(e.pointerId);const t=this.getPointerPos(e);this.pointsBuffer.push(t),this.renderSmoothLine(performance.now(),!0),this.lastPoint=null,this.pointsBuffer=[];const r=this.createCanvasEvent("pointerup",t,e);this.emit("pointerup",r)}createCanvasEvent(e,t,r){return{type:e,x:t.x,y:t.y,rawX:r.clientX,rawY:r.clientY,pressure:r.pressure||.5,pointerId:r.pointerId,pointerType:r.pointerType,isPrimary:r.isPrimary,buttons:r.buttons,originalEvent:r}}renderSmoothLine(e,t=!1){const r=e-this.lastFrameTime;!t&&r<this.targetFrameTime||(this.lastFrameTime=e,!(this.pointsBuffer.length<2)&&(!this.smoothingEnabled||this.pointsBuffer.length<3?this.drawSimpleLines():this.drawSmoothLines()))}drawSimpleLines(){this.ctx.beginPath(),this.lastPoint&&this.ctx.moveTo(this.lastPoint.x,this.lastPoint.y);for(let e=0;e<this.pointsBuffer.length;e++)this.ctx.lineTo(this.pointsBuffer[e].x,this.pointsBuffer[e].y);this.ctx.stroke(),this.lastPoint=this.pointsBuffer[this.pointsBuffer.length-1],this.pointsBuffer=this.lastPoint?[this.lastPoint]:[]}drawSmoothLines(){if(!this.lastPoint)return;this.ctx.beginPath(),this.ctx.moveTo(this.lastPoint.x,this.lastPoint.y);for(let t=1;t<this.pointsBuffer.length-1;t++){const r=this.pointsBuffer[t],s=this.pointsBuffer[t+1],i=(r.x+s.x)/2,a=(r.y+s.y)/2;this.ctx.quadraticCurveTo(r.x,r.y,i,a)}const e=this.pointsBuffer[this.pointsBuffer.length-1];this.ctx.lineTo(e.x,e.y),this.ctx.stroke(),this.lastPoint=e,this.pointsBuffer=[this.lastPoint]}emit(e,t){const r=this.eventHandlers.get(e);r&&r.forEach(s=>{try{s(t)}catch(i){console.error("Canvas event handler error:",i)}})}setSize(e,t){this.canvas.width=Math.floor(e*this.dpr),this.canvas.height=Math.floor(t*this.dpr),this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.ctx.scale(this.dpr,this.dpr),this.rectCache=null}getSize(){return{width:this.canvas.width/this.dpr,height:this.canvas.height/this.dpr}}getContext(){return this.ctx}getElement(){return this.canvas}clear(e){const{width:t,height:r}=this.getSize();e?(this.ctx.fillStyle=e,this.ctx.fillRect(0,0,t,r)):this.ctx.clearRect(0,0,t,r)}on(e,t){return this.eventHandlers.has(e)||this.eventHandlers.set(e,new Set),this.eventHandlers.get(e).add(t),()=>{var r;(r=this.eventHandlers.get(e))==null||r.delete(t)}}off(e,t){var r;(r=this.eventHandlers.get(e))==null||r.delete(t)}setSmoothing(e){this.smoothingEnabled=e}setMinDistance(e){}isCurrentlyDrawing(){return this.isDrawing}getLastPoint(){return this.lastPoint}getImageData(){return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height)}putImageData(e){this.ctx.putImageData(e,0,0)}toDataURL(e,t){return this.canvas.toDataURL(e,t)}dispose(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.eventHandlers.clear()}}class w{constructor(e,t,r){n(this,"canvasWrapper");n(this,"ctx");n(this,"toolManager");n(this,"historyManager");n(this,"isDrawing",!1);n(this,"startX",0);n(this,"startY",0);n(this,"snapshot",null);n(this,"currentPath",[]);this.toolManager=t,this.historyManager=r,this.canvasWrapper=new x(e,{enableHighDPI:!0,lineCap:"round",lineJoin:"round"}),this.ctx=this.canvasWrapper.getContext(),this.setupEventListeners(),this.initializeCanvas()}initializeCanvas(){this.ctx.strokeStyle=this.toolManager.getColor(),this.ctx.lineWidth=this.toolManager.getBrushSize(),this.ctx.fillStyle="#ffffff";const{width:e,height:t}=this.canvasWrapper.getSize();this.ctx.fillRect(0,0,e,t),this.historyManager.saveState()}setupEventListeners(){this.canvasWrapper.on("pointerdown",this.handlePointerDown.bind(this)),this.canvasWrapper.on("pointermove",this.handlePointerMove.bind(this)),this.canvasWrapper.on("pointerup",this.handlePointerUp.bind(this)),this.canvasWrapper.on("resize",this.handleResize.bind(this))}handlePointerDown(e){this.isDrawing=!0,this.startX=e.x,this.startY=e.y,this.currentPath=[{x:e.x,y:e.y}],this.snapshot=this.canvasWrapper.getImageData();const t=this.toolManager.getCurrentTool();(t==="brush"||t==="eraser")&&(this.ctx.beginPath(),this.ctx.moveTo(e.x,e.y),this.ctx.save(),t==="eraser"&&(this.ctx.globalCompositeOperation="destination-out"),this.ctx.arc(e.x,e.y,this.ctx.lineWidth/2,0,Math.PI*2),this.ctx.fill(),this.ctx.restore())}handlePointerMove(e){if(!this.isDrawing)return;this.currentPath.push({x:e.x,y:e.y});const t=this.toolManager.getCurrentTool();t==="brush"?(this.ctx.globalCompositeOperation="source-over",this.ctx.lineTo(e.x,e.y),this.ctx.stroke()):t==="eraser"?(this.ctx.globalCompositeOperation="destination-out",this.ctx.lineTo(e.x,e.y),this.ctx.stroke()):(t==="rectangle"||t==="circle"||t==="line")&&(this.snapshot&&this.canvasWrapper.putImageData(this.snapshot),this.drawShape(t,this.startX,this.startY,e.x,e.y))}handlePointerUp(e){if(!this.isDrawing)return;this.isDrawing=!1;const t=this.toolManager.getCurrentTool();t==="brush"||t==="eraser"?this.ctx.closePath():(t==="rectangle"||t==="circle"||t==="line")&&(this.snapshot&&this.canvasWrapper.putImageData(this.snapshot),this.drawShape(t,this.startX,this.startY,e.x,e.y)),this.ctx.globalCompositeOperation="source-over",this.historyManager.saveState(),this.currentPath=[]}handleResize(){}drawShape(e,t,r,s,i){switch(this.ctx.beginPath(),e){case"rectangle":this.ctx.rect(t,r,s-t,i-r),this.ctx.stroke();break;case"circle":{const a=Math.sqrt(Math.pow(s-t,2)+Math.pow(i-r,2));this.ctx.arc(t,r,a,0,Math.PI*2),this.ctx.stroke();break}case"line":this.ctx.moveTo(t,r),this.ctx.lineTo(s,i),this.ctx.stroke();break}this.ctx.closePath()}setTool(e){this.toolManager.setTool(e)}setColor(e){this.toolManager.setColor(e),this.ctx.strokeStyle=e,this.ctx.fillStyle=e}setBrushSize(e){this.toolManager.setBrushSize(e),this.ctx.lineWidth=e}clear(){const{width:e,height:t}=this.canvasWrapper.getSize();this.ctx.fillStyle="#ffffff",this.ctx.globalCompositeOperation="source-over",this.ctx.fillRect(0,0,e,t),this.historyManager.saveState()}download(e){const t=document.createElement("a");t.download=e,t.href=this.canvasWrapper.toDataURL("image/png"),t.click()}getCursorPosition(){return this.canvasWrapper.getLastPoint()}isCurrentlyDrawing(){return this.isDrawing}getCanvasSize(){return this.canvasWrapper.getSize()}dispose(){this.canvasWrapper.dispose()}}class f{constructor(){n(this,"currentTool","brush");n(this,"color","#dc2626");n(this,"brushSize",12)}setTool(e){this.currentTool=e}getCurrentTool(){return this.currentTool}setColor(e){this.color=e}getColor(){return this.color}setBrushSize(e){this.brushSize=e}getBrushSize(){return this.brushSize}}class b{constructor(e){n(this,"canvas");n(this,"history",[]);n(this,"currentIndex",-1);n(this,"maxHistory",50);this.canvas=e}saveState(){const e=this.canvas.getContext("2d");if(!e)return;this.history=this.history.slice(0,this.currentIndex+1);const t=e.getImageData(0,0,this.canvas.width,this.canvas.height);this.history.push(t),this.history.length>this.maxHistory?this.history.shift():this.currentIndex++}undo(){return this.currentIndex<=0?!1:(this.currentIndex--,this.restoreState(),!0)}redo(){return this.currentIndex>=this.history.length-1?!1:(this.currentIndex++,this.restoreState(),!0)}restoreState(){const e=this.canvas.getContext("2d");!e||this.currentIndex<0||this.currentIndex>=this.history.length||e.putImageData(this.history[this.currentIndex],0,0)}canUndo(){return this.currentIndex>0}canRedo(){return this.currentIndex<this.history.length-1}}const y=[{name:"Kırmızı",value:"#dc2626"},{name:"Mavi",value:"#2563eb"},{name:"Yeşil",value:"#16a34a"},{name:"Sarı",value:"#facc15"},{name:"Turuncu",value:"#f97316"},{name:"Mor",value:"#9333ea"},{name:"Pembe",value:"#f472b6"},{name:"Kahverengi",value:"#92400e"},{name:"Siyah",value:"#0f172a"},{name:"Beyaz",value:"#ffffff"},{name:"Gri",value:"#94a3b8"},{name:"Turkuaz",value:"#22d3ee"}];class k{constructor(){n(this,"canvasManager",null);n(this,"toolManager",null);n(this,"historyManager",null);n(this,"currentColor","#dc2626");n(this,"currentBrushSize",12)}render(){const e=document.createElement("div");e.className="flex flex-col h-screen";const t=this.createHeader();e.appendChild(t);const r=document.createElement("div");r.className="flex flex-1 overflow-hidden";const s=this.createToolbar();r.appendChild(s);const i=this.createCanvasArea();r.appendChild(i);const a=this.createSidebar();r.appendChild(a),e.appendChild(r);const l=this.createFooter();return e.appendChild(l),setTimeout(()=>{this.initializeCanvas()},0),e}createHeader(){const e=document.createElement("header");return e.className="flex items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3 shrink-0",e.innerHTML=`
      <div class="flex items-center gap-3">
        <div class="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Çizim Uygulaması</h1>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg mr-4">
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors" title="Geri Al" id="undo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button class="p-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors" title="İleri Al" id="redo-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
          </button>
        </div>
        <button class="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-sm font-medium" id="clear-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          <span>Temizle</span>
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold" id="download-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>İndir</span>
        </button>
        <div class="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2"></div>
        <button class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    `,setTimeout(()=>{var t,r,s,i;(t=e.querySelector("#undo-btn"))==null||t.addEventListener("click",()=>this.handleUndo()),(r=e.querySelector("#redo-btn"))==null||r.addEventListener("click",()=>this.handleRedo()),(s=e.querySelector("#clear-btn"))==null||s.addEventListener("click",()=>this.handleClear()),(i=e.querySelector("#download-btn"))==null||i.addEventListener("click",()=>this.handleDownload())},0),e}createToolbar(){const e=document.createElement("aside");return e.className="w-20 bg-white dark:bg-background-dark border-r border-primary/10 flex flex-col items-center py-6 gap-6 shrink-0",[{type:"brush",icon:'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>',label:"Fırça"},{type:"eraser",icon:'<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',label:"Silgi"},{type:"rectangle",icon:'<rect width="18" height="18" x="3" y="3" rx="2"/>',label:"Dikdörtgen"},{type:"circle",icon:'<circle cx="12" cy="12" r="10"/>',label:"Daire"},{type:"line",icon:'<path d="M5 12h14"/>',label:"Çizgi"}].forEach((r,s)=>{const i=s===0,a=document.createElement("div");a.className="group relative",a.innerHTML=`
        <button class="p-3 ${i?"bg-primary text-white shadow-lg shadow-primary/20":"hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"} rounded-xl flex items-center justify-center transition-all tool-btn" data-tool="${r.type}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${r.icon}</svg>
        </button>
        <span class="tooltip">${r.label}</span>
      `,e.appendChild(a)}),setTimeout(()=>{e.querySelectorAll(".tool-btn").forEach(r=>{r.addEventListener("click",s=>{const i=s.currentTarget.dataset.tool;this.setTool(i),e.querySelectorAll(".tool-btn").forEach(a=>{a.className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center transition-all tool-btn"}),s.currentTarget.className="p-3 bg-primary text-white shadow-lg shadow-primary/20 rounded-xl flex items-center justify-center transition-all tool-btn"})})},0),e}createCanvasArea(){const e=document.createElement("main");return e.className="flex-1 bg-background-light dark:bg-background-dark p-6 relative overflow-hidden",e.innerHTML=`
      <div class="w-full h-full bg-white dark:bg-white/5 rounded-2xl shadow-inner border border-primary/5 flex items-center justify-center relative overflow-hidden" id="canvas-wrapper">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
        <canvas id="drawing-canvas" class="absolute inset-0 w-full h-full cursor-crosshair"></canvas>
      </div>
    `,e}createSidebar(){const e=document.createElement("aside");e.className="w-72 bg-white dark:bg-background-dark border-l border-primary/10 flex flex-col p-6 gap-8 shrink-0";const t=document.createElement("div");t.innerHTML=`
      <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Renk Paleti</h3>
      <div class="grid grid-cols-4 gap-3 mb-4" id="color-grid">
        ${y.map((a,l)=>`
          <button 
            class="w-10 h-10 rounded-full ${l===0?"border-4 border-white dark:border-slate-800 ring-2 ring-primary":"border-2 border-transparent"} shadow-sm color-btn transition-all hover:scale-110" 
            style="background-color: ${a.value}"
            data-color="${a.value}"
            data-name="${a.name}"
            title="${a.name}"
          ></button>
        `).join("")}
      </div>
      <button class="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" id="custom-color-btn">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l-4 4-3 3-1.4 1.4a2.1 2.1 0 1 1-3-3L9 13Z"/></svg>
          <span>Özel Renk</span>
        </div>
        <div class="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-purple-500 border border-white dark:border-slate-700"></div>
      </button>
    `;const r=document.createElement("div");r.className="p-4 bg-primary/5 rounded-xl border border-primary/10",r.innerHTML=`
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg shadow-md" id="active-color-preview" style="background-color: ${this.currentColor}"></div>
        <div>
          <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Aktif Renk</p>
          <p class="text-sm font-bold" id="active-color-name">Kırmızı</p>
        </div>
      </div>
    `;const s=document.createElement("div");s.innerHTML=`
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fırça Boyutu</h3>
        <span class="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full" id="brush-size-display">${this.currentBrushSize}px</span>
      </div>
      <div class="relative flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>
        <input type="range" min="1" max="50" value="${this.currentBrushSize}" class="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" id="brush-size-slider">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    `;const i=document.createElement("div");return i.className="mt-auto",i.innerHTML=`
      <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Katmanlar</h3>
      <div class="flex items-center gap-3 p-3 bg-primary text-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        <span class="text-sm font-semibold flex-1">Katman 1</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
    `,e.appendChild(t),e.appendChild(r),e.appendChild(s),e.appendChild(i),setTimeout(()=>{e.querySelectorAll(".color-btn").forEach(d=>{d.addEventListener("click",c=>{const p=c.currentTarget.dataset.color,u=c.currentTarget.dataset.name;this.setColor(p,u),e.querySelectorAll(".color-btn").forEach(g=>{g.className="w-10 h-10 rounded-full border-2 border-transparent shadow-sm color-btn transition-all hover:scale-110"}),c.currentTarget.className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 ring-2 ring-primary shadow-sm color-btn transition-all hover:scale-110"})});const a=e.querySelector("#brush-size-slider"),l=e.querySelector("#brush-size-display");a==null||a.addEventListener("input",d=>{const c=parseInt(d.target.value);this.setBrushSize(c),l&&(l.textContent=`${c}px`)})},0),e}createFooter(){const e=document.createElement("footer");return e.className="h-8 bg-slate-50 dark:bg-background-dark border-t border-primary/10 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium",e.innerHTML=`
      <div class="flex gap-4">
        <span>Tuval: 1920x1080</span>
        <span>Zoom: %100</span>
      </div>
      <div class="flex gap-4">
        <span>Konum: <span id="cursor-position">245, 612</span></span>
        <span class="text-primary">Hazır</span>
      </div>
    `,e}initializeCanvas(){const e=document.getElementById("drawing-canvas");e&&(this.historyManager=new b(e),this.toolManager=new f,this.canvasManager=new w(e,this.toolManager,this.historyManager),this.canvasManager.setTool("brush"),this.canvasManager.setColor(this.currentColor),this.canvasManager.setBrushSize(this.currentBrushSize),this.startCursorTracking(),this.updateCanvasSizeDisplay())}startCursorTracking(){const e=()=>{var s;const t=(s=this.canvasManager)==null?void 0:s.getCursorPosition(),r=document.getElementById("cursor-position");r&&(t?r.textContent=`${Math.round(t.x)}, ${Math.round(t.y)}`:r.textContent="--, --"),requestAnimationFrame(e)};requestAnimationFrame(e)}updateCanvasSizeDisplay(){var r;const e=(r=this.canvasManager)==null?void 0:r.getCanvasSize(),t=document.querySelector("footer");if(t&&e){const s=t.querySelector("span:first-child");s&&(s.textContent=`Tuval: ${Math.round(e.width)}x${Math.round(e.height)}`)}}setTool(e){var t;(t=this.canvasManager)==null||t.setTool(e)}setColor(e,t){var i;this.currentColor=e,(i=this.canvasManager)==null||i.setColor(e);const r=document.getElementById("active-color-preview"),s=document.getElementById("active-color-name");r&&(r.style.backgroundColor=e),s&&(s.textContent=t)}setBrushSize(e){var t;this.currentBrushSize=e,(t=this.canvasManager)==null||t.setBrushSize(e)}handleUndo(){var e;(e=this.historyManager)==null||e.undo()}handleRedo(){var e;(e=this.historyManager)==null||e.redo()}handleClear(){var e;confirm("Tuvali temizlemek istediğinizden emin misiniz?")&&((e=this.canvasManager)==null||e.clear())}handleDownload(){var e;(e=this.canvasManager)==null||e.download("cizim.png")}}class C{constructor(e){n(this,"props");this.props=e}render(){const e=document.createElement("div");e.className="flex h-screen w-full flex-col overflow-hidden";const t=document.createElement("header");t.className="flex items-center justify-between border-b border-primary/10 bg-white dark:bg-background-dark px-6 py-3",t.innerHTML=`
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Çizim Uygulaması</h2>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" id="share-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        </button>
        <button class="flex h-10 px-4 items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity" id="save-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <span>Kaydet</span>
        </button>
      </div>
    `;const r=document.createElement("main");r.className="flex flex-1 overflow-hidden";const s=document.createElement("aside");s.className="w-64 border-r border-primary/10 bg-white dark:bg-background-dark p-4 flex flex-col gap-6",s.innerHTML=`
      <div>
        <h3 class="text-xs font-bold uppercase tracking-wider text-primary mb-4">Araçlar</h3>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="text-sm font-semibold">Fırça</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="text-sm font-medium">Kalem</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
            <span class="text-sm font-medium">Silgi</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span class="text-sm font-medium">Şekil</span>
          </div>
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/></svg>
            <span class="text-sm font-medium">Seçim</span>
          </div>
        </div>
      </div>
      <div class="mt-auto">
        <h3 class="text-xs font-bold uppercase tracking-wider text-primary mb-4">Renk Paleti</h3>
        <div class="grid grid-cols-4 gap-2">
          <div class="aspect-square rounded-full bg-primary border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-amber-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-sky-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-emerald-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-slate-900 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-slate-400 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full bg-purple-500 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div class="aspect-square rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 cursor-pointer hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
        </div>
      </div>
    `;const i=document.createElement("section");i.className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-8 flex items-center justify-center",i.innerHTML=`
      <div class="max-w-md w-full bg-white dark:bg-background-dark rounded-xl border-2 border-dashed border-primary/20 p-12 flex flex-col items-center text-center shadow-sm">
        <div class="relative mb-8">
          <div class="absolute -inset-4 bg-primary/5 rounded-full blur-2xl"></div>
          <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          </div>
          <div class="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-background-dark shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Çizmeye Başlayın</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
          Fırça ve renk seçerek çizim yapmaya başlayabilirsiniz.
        </p>
        <p class="text-sm font-medium text-primary mb-8 px-4 py-1.5 bg-primary/5 rounded-full">
          Sol panelden araçları seçin
        </p>
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <button class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-bold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95" id="start-drawing-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l4-4h12a8 8 0 0 0 0-16Z"/></svg>
            <span>Yeni Tuval Oluştur</span>
          </button>
        </div>
      </div>
    `,r.appendChild(s),r.appendChild(i);const a=document.createElement("div");return a.className="fixed bottom-6 right-6",a.innerHTML=`
      <button class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all" id="fab-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      </button>
    `,e.appendChild(t),e.appendChild(r),e.appendChild(a),setTimeout(()=>{const l=e.querySelector("#start-drawing-btn"),d=e.querySelector("#fab-btn");l==null||l.addEventListener("click",()=>this.props.onStartDrawing()),d==null||d.addEventListener("click",()=>this.props.onStartDrawing())},0),e}}class S{constructor(e){n(this,"props");this.props=e}render(){const e=document.createElement("div");e.className="relative flex h-screen w-full flex-col overflow-x-hidden",e.style.backgroundImage="radial-gradient(#e21d4822 1px, transparent 1px)",e.style.backgroundSize="20px 20px";const t=document.createElement("header");t.className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md",t.innerHTML=`
      <div class="flex items-center gap-3">
        <div class="size-10 flex items-center justify-center rounded-xl bg-primary text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
        </div>
        <h2 class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Hata Durumu</h2>
      </div>
      <div class="flex gap-2">
        <button class="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" id="settings-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" id="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    `;const r=document.createElement("main");r.className="flex flex-1 flex-col items-center justify-center px-6 text-center",r.innerHTML=`
      <div class="max-w-md w-full p-8 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-primary/5 flex flex-col items-center gap-8">
        <!-- Playful Illustration -->
        <div class="relative w-64 h-64 flex items-center justify-center">
          <!-- Abstract Creative Error Illustration -->
          <div class="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-violet-500/20 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex flex-col items-center">
            <!-- Spilled Paint Bucket / Broken Tool Concept -->
            <div class="w-32 h-32 bg-primary rounded-2xl rotate-12 flex items-center justify-center relative shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 19-7-7 3-3 7 7"/><path d="m18 13 1.5-7.5L21 4l-3.5 14.5L11 18l-5-5"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              <div class="absolute -bottom-4 -left-8 w-24 h-12 bg-primary/40 rounded-full blur-md"></div>
              <div class="absolute -bottom-6 -right-4 w-16 h-8 bg-violet-500/40 rounded-full blur-md"></div>
            </div>
            <div class="mt-4 flex gap-2">
              <div class="w-3 h-3 rounded-full bg-rose-400 animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-3 h-3 rounded-full bg-violet-400 animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-3 h-3 rounded-full bg-primary animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
          <!-- Broken Pencil Decoration -->
          <div class="absolute top-0 right-0 -rotate-45 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m12 19-7-7 3-3 7 7"/><path d="m18 13 1.5-7.5L21 4l-3.5 14.5L11 18l-5-5"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
          </div>
        </div>
        <!-- Error Messages -->
        <div class="space-y-3">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bir Hata Oluştu
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Canvas yüklenirken bir sorun oluştu. <br/>Lütfen sayfayı yenileyin.
          </p>
        </div>
        <!-- Action Button -->
        <div class="w-full pt-4">
          <button class="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/25" id="retry-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            <span>Yenile</span>
          </button>
        </div>
        <!-- Footer Info -->
        <div class="pt-4 flex flex-col items-center gap-1">
          <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">Hata Kodu</span>
          <code class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-primary font-mono text-sm">ERR_CANVAS_LOAD_05</code>
        </div>
      </div>
      <!-- Playful floating elements -->
      <div class="absolute bottom-10 left-10 opacity-20 hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></svg>
      </div>
      <div class="absolute top-40 right-10 opacity-20 hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
      </div>
    `;const s=document.createElement("footer");return s.className="p-6 flex justify-center items-center",s.innerHTML=`
      <div class="flex gap-4 p-2 bg-white/50 dark:bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400 py-1 px-2">Sanat bekleyebilir, teknik ekip kontrol ediyor.</p>
      </div>
    `,e.appendChild(t),e.appendChild(r),e.appendChild(s),setTimeout(()=>{const i=e.querySelector("#retry-btn");i==null||i.addEventListener("click",()=>this.props.onRetry())},0),e}}class h{constructor(){n(this,"container",null);n(this,"currentScreen","empty");n(this,"drawingScreen",null);n(this,"emptyStateScreen",null);n(this,"errorScreen",null)}mount(e){this.container=e,this.render()}render(){if(this.container)switch(this.container.innerHTML="",this.currentScreen){case"drawing":this.drawingScreen||(this.drawingScreen=new k),this.container.appendChild(this.drawingScreen.render());break;case"error":this.errorScreen||(this.errorScreen=new S({onRetry:()=>this.navigateTo("empty")})),this.container.appendChild(this.errorScreen.render());break;case"empty":default:this.emptyStateScreen||(this.emptyStateScreen=new C({onStartDrawing:()=>this.navigateTo("drawing")})),this.container.appendChild(this.emptyStateScreen.render());break}}navigateTo(e){this.currentScreen=e,this.render()}getCurrentScreen(){return this.currentScreen}}window.appNavigate=o=>{new h().navigateTo(o)};const M=new h;M.mount(document.getElementById("app"));
//# sourceMappingURL=index-BnT3vAWA.js.map
