const res = await fetch("https://openrouter.ai/api/v1/models", {
  headers: {
    "Authorization": "Bearer YOUR_OPENROUTER_KEY_HERE",
  }
});

const data = await res.json();
const freeModels = data.data.filter(m => 
  m.pricing?.prompt === "0" || 
  m.id.includes(":free")
);

console.log("FREE MODELS AVAILABLE:");
freeModels.forEach(m => console.log(m.id));