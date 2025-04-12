from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("where-to-go/", views.where_to_go, name="where-to-go"),
    path("things-to-do/", views.things_to_do, name="things-to-do"),
    path("plan-your-trip/", views.plan_your_trip, name="plan-your-trip"),
    path("information/", views.information, name="information"),
]
