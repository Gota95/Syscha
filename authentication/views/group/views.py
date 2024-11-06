from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View, ListView, CreateView, UpdateView
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from authentication.forms import GroupForm
from django.urls import reverse_lazy
import datetime


class GroupListView(ListView):
  model = Group
  template_name = "group/index.html"

  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def get_queryset(self):
    return Group.objects.all()

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context["title"] = 'Roles'
    context["madmin"] = 'menu-open'
    context["role"] = 'active'
    return context

class GroupCreateView(LoginRequiredMixin,CreateView):
  model = Group
  form_class = GroupForm
  template_name = "group/create.html"

  def get_success_url(self):
    messages.success(self.request, '¡Rol agregado con éxito!')
    return reverse_lazy('authentication:role')

  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    content_types = ContentType.objects.all()
    permissions = list()
    for ctype in content_types:
      perms = Permission.objects.filter(content_type__id=ctype.pk)
      group = {
        'label':ctype.name,
        'perms': perms
      }
      permissions.append(group)
    context['title'] = 'Agregar rol de usuario'
    context['permissions'] = permissions
    return context

class GroupUpdateView(LoginRequiredMixin,UpdateView):
  model = Group
  form_class = GroupForm
  template_name = "group/edit.html"

  def get_success_url(self):
    messages.success(self.request, '¡Rol editado con éxito!')
    return reverse_lazy('authentication:role')
  
  def dispatch(self, request, *args, **kwargs):
    return super().dispatch(request, *args, **kwargs)
  
  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context["title"] = 'Editar rol de usuario'
    return context