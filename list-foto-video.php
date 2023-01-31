<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale = 1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css"> 
    <title>Lista de Fotos y Videos</title>
    <style>
Html {
  box-sizing: border-box;
  font-family: sans-serif;
  font-size: 16px;
}

*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: inherit;
}

:root {
  --gap-img: 0.8em;
}

.section__masonry {
  display: flex;
  justify-content: center;
  margin-top: 10em;
}

.section__masonry-wrapper {
  width: 576;
  columns: 2;
  padding-right: var(--gap-img);
  padding-left: var(--gap-img);
}

.section__masonry-wrapper__item {
  width: 100%;
}

.section__masonry-wrapper__item-img {
  width: 100%;
  height: auto;
  margin-bottom: var(--gap-img);
}

@media (min-width: 768px) {
  .section__masonry-wrapper {
    columns: 3;
    width: 970px;
  }
}

@media (min-width: 992px) {
  .section__masonry-wrapper {
    columns: 3;
  }
}
#cont{
    margin-top: 50px;
    display: flex;
    justify-content: center;
    background-color: #ceee;
    padding: 10px;
}

    </style>
  </head>
<body>


<div id="cont">
  <a href="index.html">< VOLVER </a>
</div>
<?php
include('static/config.php');
$sqlGroomers = ("SELECT * FROM archivos order by id desc");
$queryGroomers = mysqli_query($con, $sqlGroomers);
?>
  <section class="section__masonry">
    <div class="section__masonry-wrapper">
    <?php
	  while ($dataProduct = mysqli_fetch_array($queryGroomers)) {
      $extension_archivo = pathinfo($dataProduct['nameFile'], PATHINFO_EXTENSION); ?>

   
      <?php  if($extension_archivo =='mp4'){ ?>
        <div class="section__masonry-wrapper__item">
          <iframe src="files/videos/<?php echo $dataProduct['nameFile']; ?>" title="description"></iframe>
        </div>
      <?php }else{ ?>
        <div class="section__masonry-wrapper__item">
          <img src="files/fotos/<?php echo $dataProduct['nameFile']; ?>" alt="foto" class="section__masonry-wrapper__item-img">
        </div>
      <?php }  } ?>
    
    </div>
  </section>



  <script  src="https://code.jquery.com/jquery-2.2.4.js"  integrity="sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI=" crossorigin="anonymous"></script>

</body>
</html>
