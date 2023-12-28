const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },

  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },

  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    consol.error(e);
  }
  return response.json();
};

const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    consol.error(e);
  }
  return response;
};

// api 객체 : 모든메뉴리스트(카테고리별 데이터만 받아와야 함.)
const MenuApi = {
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  // 메뉴를 새롭게 생성
  createMenu(category, name) {
    return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name }));
  },

  // 업데이트된 메뉴 수정
  async updateMenu(category, name, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
  },

  // 토글 메뉴
  async toggleSoldOutMenu(category, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
  },

  // 삭제
  async deleteMenu(category, menuId) {
    return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
  },
};

export default MenuApi;
