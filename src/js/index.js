// TODO localStorage Read & Write
// - [ ] localStorage에 데이터를 저장한다.
//  - [x] 메뉴를 추가할 때
//  - [x] 메뉴를 수정할 때
//  - [x] 메뉴를 삭제할 때
// - [x] 새로고침해도 데이터가 남아있게 한다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다. (카테고리별 메뉴판 관리)

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 접근할 때 localStorage에서 데이터를 불러온다.
// - [x] 불러온 데이터로 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [x] 클릭이벤트에서 가장 가까운 li태그롸 class속성 값에 sold-out을 추가한다.
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

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
  // 현재 카테고리별
  this.currentCategory = "espresso";
  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${menuItem.soldOut ? "sold-out" : ""} ">${menuItem.name}</span>
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

  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const MenuName = $("#menu-name").value;
    // 현재 카테고리 속성
    this.menu[this.currentCategory].push({ name: MenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = ""; // input 빈 값 초기화
  };

  // 메뉴 수정 함수
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  // 메뉴 삭제 함수
  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      e.target.closest("li").remove();
      render();
    }
  };

  // 품절
  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
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
    $("nav").addEventListener("click", (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
      // 예외처리 : 해당 클래스만 찾아서 이벤트 처리
      if (isCategoryButton) {
        // 데이터 속성 갖고 오기
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        // 카테고리 안에 타이틀 값을 바꿈
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App(); // 생성자 함수로 사용하기 위해 new 키워드를 사용하여 인스턴스를 생성합니다.
app.init();
