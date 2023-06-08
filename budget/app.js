//? Selectors
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani")
const tarihInput = document.getElementById("tarih")
const miktarInput = document.getElementById("miktar")
const gideriniz = document.getElementById("gideriniz")
const kalan = document.getElementById("kalan")


//?Table
const harcamaBody = document.getElementById("harcama-body")
const temizleBtn = document.getElementById("temizleBtn")


//?Functions

//?Result Table
const gelirinizID = document.getElementById("geliriniz");

//?Harcama formu
const harcamaFormu = document.getElementById("harcama-formu");

//? Variables
let gelirler=0

let harcamaListesi = []


//?Events
//!Gelir girilen değeri yazar ve toplar
ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault() //? reload'u engeller
  gelirler = gelirler + Number(gelirInput.value) //? string eklemiyi engelledik

  //? gelirlerin kalıcı olmasi icin localStorage a kopyaliyoruz
  localStorage.setItem("gelirler", gelirler)

  //? input degerini sifrladik
  ekleFormu.reset()

  //? Degisiklikleri sonuc tablosuna yazan fonks.
  hesapla()
})
//!Sayfa yüklendikten sonra çalışan fonksiyon
window.addEventListener("load", () => {
    gelirler = Number(localStorage.getItem("gelirler"))
    harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || []
    if (harcamaListesi.length > 0) {
    harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama))
    }

    tarihInput.value = new Date().toISOString().slice(0, 10)
    hesapla()


})



//!Harcama formunu submit edildiğinde çalışan fonksiyon
harcamaFormu.addEventListener("submit", (e) => {
    e.preventDefault();
    //!Local Storage'a harcama ekleme
    let yeniHarcama = {
        id:new Date().getTime(), 
        tarih: tarihInput.value, 
        alan: harcamaAlaniInput.value, 
        miktar: miktarInput.value,}

        harcamaListesi.push(yeniHarcama)
        localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))

        harcamayiDomaYaz(yeniHarcama)

        hesapla()

        harcamaFormu.reset()       
        tarihInput.value = new Date().toISOString().slice(0, 10)

        
})



//? Functions
//!Gelir tablosunu doldurur
const hesapla = () => {
  const giderler = harcamaListesi.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  )

  geliriniz.innerText = gelirler
  gideriniz.innerText = giderler
  kalan.innerText = gelirler - giderler
  }

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
    // const { id, miktar, tarih, alan } = yeniHarcama
    harcamaBody.innerHTML += `
    <tr>
      <td>${tarih}</td>
      <td>${alan}</td>
      <td>${miktar}</td>
      <td><i id=${id} class="fa-solid fa-trash-can text-danger" type="button"></i></td>
    </tr>
    `
  }

  harcamaBody.addEventListener("click", (e) => {
    // console.log(e.target)
  
    //! Event bir sil butonundan geldi ise
    if (e.target.classList.contains("fa-trash-can")) {
      //! DOM'dan ilgili row'u sildik.
      e.target.parentElement.parentElement.remove()  
      const id = e.target.id  
      //! Dizideki ilgili objeyi sildik.
      harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id)
      //! Silinmis yeni diziyi Local Storage aktardik.
      localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))   
      hesapla()
    }
  })
  
  temizleBtn.addEventListener("click", () => {
    if (confirm("Silmek istediğinize emin misiniz?")){
      harcamaListesi = []
    gelirler = 0
    localStorage.clear();
    harcamaBody.innerHTML = ""
    hesapla();
    }
    
  });

 