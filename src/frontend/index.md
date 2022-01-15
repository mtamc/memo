---
title: Home
layout: layouts/base.njk
---

<div class="container">
  <div class="row" style="padding:20px">
     <div class="hidden-xs col-sm-3 col-md-2" id="sidebar" role="navigation" style="margin-top:180px">
      <hr>
      <ul class="nav nav-pills nav-stacked">
        <li><a href="/">Home</a></li>
        <li><div data-netlify-identity-button></div> </li>
      </ul>
    </div>
    <div class="col-xs-12 col-sm-9 col-md-9">
      <div class="row">
        <h1>Homepage</h1>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <h3><a href="films">Films</a></h3>
          <table id="home-films" > </table>
        </div>
        <div class="col-md-6">
          <h3><a href="video-games">Video Games</a></h3>
          <table id="home-games" > </table>
        </div>
      </div>
      <hr>
    </div>
  </div>
  <hr>
  <footer> &nbsp; </footer>
</div>
