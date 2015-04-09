Turkcell Curio Web SDK (Yeni)
=========

> Turkcell Curio ile kullanıcılarınızın web sitenizdeki hareketlerini gözlemleyebilirsiniz.

Sitenize ekleyin
--------------
  - https://gui-curio.turkcell.com.tr adresinden uygulamanızı oluşturun.
  - Aşagıdaki kodu web sayfanıza ekleyiniz.
  - Oluşturdugunuz uygulamanın TRACKING_CODE ve API_KEY değerlerini aşagıdaki koda yerleştirin.
  

```sh
    <script src="https://curio.turkcell.com.tr/api/js/curio-2.0.0.js"></script>
    <script type='text/javascript'>
    	Curio.init("API_KEY", "TRACKING_CODE");
    </script>
```

Kullanımı
--------------
Kullanıcıların hareketlerini gözlemlemek için kaydetmek istediğiniz kullanıcı etkileşimlerini Turkcell Curio'ya göndermelisiniz.
<br />
Yukarıdaki kodu sitenize ekledikten sonra, bu kodun size sağladığı API ile Turkcell Curio'ya bilgi gönderimi yapabilirsiniz.
<br />
Bu bilgiler yeni bir sayfa açılması, web sitenizdeki bir elemente tıklanması veya bulunulan sayfanın terk edilmesi gibi hareketleri içerebilir.
<br />

API
--------------
Turkcell Curio'yu size sağlanan 5 adet fonksiyon ile kullanabilirsiniz.
  - Yeni Ziyaret (New Visit)
  - Yeni Sayfa (New Hit)
  - Yeni Etkileşim (New Event)
  - Sayfa Çıkış (End Hit)
  - Ziyareti Bitir (End Visit)

<br />
Yeni Ziyaret (New Visit)
--------------
**Curio için sayfanıza eklediğiniz JavaScript kodu (Curio.init) ile yeni ziyaret yaratılacaktır. Sizin yeni bir ziyaret yaratmak için herhangi bir şey yapmanıza gerek yoktur.**  

Yeni ziyaret yaratıldıktan sonra sunucudan gelen gelen parametreler kendiliğinden Curio.clientData nesnesine yazılacaktır. Sizin response ile ilgili bir şey yapmanıza gerek yoktur. Sunucu hatası, bağlantı hatası vb. sebeplerden ötürü yeni ziyaret yaratılamadığı zaman Curio'ya yapılacak her istek öncesi yeni ziyaret oluşturma denemesi yapılacaktır.

Yeni Sayfa (New Hit)
--------------
Zorunlu Parametreler
  - pageTitle
  - path

Örnek Kullanım
--------------
Curio.hitCreate() fonksiyonunu kullanarak çağırım yapabilirsiniz. 

```sh
    Curio.hitCreate({pageTitle: "Page Title", path: "Page URL"});

```

Yeni Etkileşim (New Event)
--------------
Zorunlu Parametreler
  - eventKey
  - eventValue

Örnek Kullanım
--------------
Curio.eventCreate() fonksiyonunu kullanarak çağırım yapabilirsiniz. 

```sh
    Curio.eventCreate({eventKey: "Event Key", eventValue: "Event Value"});

```

Sayfa Çıkış (End Hit)
--------------
Zorunlu Parametreler
  - pageTitle
  - path

Örnek Kullanım
--------------
Curio.hitEnd() fonksiyonunu kullanarak çağırım yapabilirsiniz. 

```sh
    Curio.hitEnd({pageTitle: "Page Title", path: "Page URL"});

```

Ziyareti Bitir (End Visit)
--------------
**Sayfa kapatıldığı zaman ziyaret kendiğilinden sonlanacaktır. Sizin ziyareti bitirmek için herhangi bir şey yapmanıza gerek yoktur.**

Dependencies
----
None

Version
----
0.2

License
----
GPL

