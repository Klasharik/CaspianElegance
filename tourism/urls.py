from django.shortcuts import render
from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("plan-your-trip/", views.plan_your_trip, name="plan-your-trip"),
    path('profile/', views.profile, name='profile'),
    path('favourites/', views.favourites, name='favourites'),
    path('favourite/<str:item_type>/<int:item_id>/', views.toggle_favourite, name='toggle_favourite'),
    path('favourites/clear-positions/', views.clear_favourite_positions, name='clear_favourite_positions'),
]
