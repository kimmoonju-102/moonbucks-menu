import { $ } from "./utils/dom.js";
import store from "./store/index.js";
// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴명을 추가될 수 있도록 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [x] 서버에 메뉴가 수정 될 수 있도록 요청한다.
// - [] 서버에 메뉴와 품절상태가 토글될 수 있도록 요청한다.
// - [] 서버에 메뉴가 삭제 될 수 있도록 요청한다.

// TODO 리펙토링 부분
//  - [] localStorage에 저장하는 로직은 지운다.
//  - [] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
//  - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.

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

function App() {
  //  상태 = 변할 수 있는 데이터 : 메뉴명 상태관리
  // menu를 배열로 초기화해서 데이터 관리
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  // 현재 카테고리별 메뉴 가져오기 : espresso로 초기화 해둬서 항상 알고 있음.
  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const render = () => {
    // this.menu[this.currentCategory]에 데이터를 넣어줘야 한다.
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
        <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${menuItem.isSoldOut ? "sold-out" : ""} ">${menuItem.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    // 총 갯수 함수
    updateMenuCount();
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    // 현재 카테고리 속성
    await MenuApi.createMenu(this.currentCategory, menuName);
    // 데이터 리스트 받아오기
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    $("#menu-name").value = ""; // input 빈 값 초기화
  };

  // 메뉴 수정 함수
  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
  };

  // 메뉴 삭제 함수
  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
      render();
    }
  };

  // 품절
  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // form 태그가 자동으로 전송되는 걸 막아준다
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // 확인버튼
    $("#menu-submit-button").addEventListener("click", addMenuName);

    // element 찾고, 이벤트 받기
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    // 카테고리별로 관리하기
    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
      // 예외처리 : 해당 클래스만 찾아서 이벤트 처리
      if (isCategoryButton) {
        // 데이터 속성 갖고 오기
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        // 카테고리 안에 타이틀 값을 바꿈
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        render();
      }
    });
  };
}

const app = new App(); // 생성자 함수로 사용하기 위해 new 키워드를 사용하여 인스턴스를 생성합니다.
app.init();
