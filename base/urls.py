from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby),
    path('room', views.room),

    path('get_token/', views.getToken),

    path('create_member/', views.createMeber),
    path('get_member/', views.getMember),
    path('delete_member/', views.deleteMember),
]
