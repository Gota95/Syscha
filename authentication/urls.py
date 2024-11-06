from django.urls import path
from authentication.views.auth.views import *
from authentication.views.user.views import *
from authentication.views.group.views import *

app_name= 'authentication'

urlpatterns = [
    path('login/', LoginFormView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserListView.as_view(), name='user'),
    path('user/create/',UserCreateView.as_view(), name='user_create'),
    path('user/<int:pk>/edit/',UserUpdateView.as_view(), name='user_edit'),
    path('user/<int:pk>/permission/',UserUpdateView.as_view(), name='user_permission'),
    path('user/profile/',UserProfileView.as_view(),name='user_profile'),
    path('role/',GroupListView.as_view(),name='role'),
    path('role/create/',GroupCreateView.as_view(),name='role_create'),
    path('role/<int:pk>/edit/',GroupUpdateView.as_view(),name='role_edit')
  ]