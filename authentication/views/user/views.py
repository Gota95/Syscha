from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View, ListView, CreateView, UpdateView
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from authentication.forms import UserEditForm
from django.db.models import Q
from django.urls import reverse_lazy
import datetime

class UserListView(LoginRequiredMixin,ListView):
  model = User
  template_name = "user/index.html"

  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def get_queryset(self):
    return User.objects.all()

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context["title"] = 'Usuarios'
    context["madmin"] = 'menu-open'
    context["user"] = 'active'
    return context

class UserCreateView(CreateView):
  model = User
  form_class = UserCreationForm
  template_name = 'user/create.html'

  def get_success_url(self):
    return reverse_lazy('authentication:user')
  
  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    return context

class UserUpdateView(LoginRequiredMixin,UpdateView):
  model = User
  form_class = UserEditForm
  template_name = "user/edit.html"

  def get_success_url(self):
    messages.success(self.request, '¡Usuario editado con éxito!')
    return reverse_lazy('authentication:user')

  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def post(self, request, *args, **kwargs):
    try:
      data = request.POST
      user = self.get_object()
      user.first_name = data['first_name']
      user.last_name = data['last_name']
      user.email = data['email']
      user.is_staff = True if 'is_staff' in data else False
      user.is_active = True if 'is_active' in data else False
      user.is_superuser = True if 'is_superuser' in data else False
      user.save()
      user.groups.clear()
      group = Group.objects.get(pk = data['groups'])
      user.groups.add(group)
    except Exception as e:
      messages.error(self.request,str(e))
      return HttpResponseRedirect('authentication:user_edit')
    return HttpResponseRedirect(self.get_success_url())
  
  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    return context

class UserProfileView(LoginRequiredMixin,ListView):
  model = User
  template_name = "user/profile.html"

  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def get_queryset(self):
    return User.objects.filter(pk=self.request.user.pk)

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context["title"] = 'Perfil'
    return context