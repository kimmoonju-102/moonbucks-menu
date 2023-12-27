const BASE_URL = "http://localhost:3000/api";

// api 객체 : 모든메뉴리스트(카테고리별 데이터만 받아와야 함.)
const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  // 메뉴를 새롭게 생성
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // key와 value가 같으면 하나만 받아와도 됨.
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      consol.error("에러가 발생했습니다.");
    }
  },

  // 업데이트된 메뉴 수정
  async updateMenu(category, name, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      consol.error("에러가 발생했습니다.");
    }
    return response.json();
  },
  // 토글 메뉴
  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
      method: "PUT",
    });
    if (!response.ok) {
      consol.error("에러가 발생했습니다.");
    }
  },

  // 삭제
  async deleteMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      consol.error("에러가 발생했습니다.");
    }
  },
};

export default MenuApi;
