from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("plan-your-trip/", views.plan_your_trip, name="plan-your-trip"),
]
