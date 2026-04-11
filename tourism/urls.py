from django.shortcuts import render
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("plan-your-trip/", views.plan_your_trip, name="plan-your-trip"),
    path('register/', views.register, name='register'),
    path('success/', lambda request: render(request, 'success.html'), name='registration_success'),
]
