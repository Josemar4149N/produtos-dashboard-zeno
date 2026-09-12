const API_BASE_URL = "https://backend-nodejs-q65c.onrender.com";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID ?? "user-id";

const productsToFix = [
  {
    id: "6aa5c704e65860d843e2403b",
    data: {
      description:
        "Smartphone Samsung com tela AMOLED de 6.4 polegadas, câmera tripla de 50MP e bateria de longa duração.",
    },
  },
  {
    id: "6aa5c704e65860d843e2403c",
    data: {
      description:
        "Monitor ultrawide de 29 polegadas com resolução Full HD, ideal para produtividade e multitarefa.",
    },
  },
  {
    id: "6aa5c704e65860d843e2403d",
    data: {
      name: "Teclado Mecânico RGB",
      description:
        "Teclado mecânico com switches blue, iluminação RGB personalizável e design ergonômico para gamers.",
    },
  },
  {
    id: "6aa5c704e65860d843e2403e",
    data: {
      description:
        "Mouse sem fio premium com sensor de alta precisão, scroll MagSpeed e design ergonômico para produtividade.",
    },
  },
  {
    id: "6aa5c704e65860d843e2403f",
    data: {
      name: "Headset HyperX Cloud II",
      description:
        "Headset gamer com som surround 7.1, microfone removível com cancelamento de ruído e almofadas memory foam.",
    },
  },
];

async function updateProduct(id, data) {
  const url = `${API_BASE_URL}/api/products?id=${id}&user=${USER_ID}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to update ${id}: ${message}`);
  }

  return response.json();
}

async function main() {
  for (const product of productsToFix) {
    await updateProduct(product.id, product.data);
    console.log(`Updated: ${product.id}`);
  }

  console.log("All products updated with UTF-8 encoding.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
