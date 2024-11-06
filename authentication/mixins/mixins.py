from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib.auth.models import Group
from django.http import HttpResponseRedirect
from django.contrib import messages

class PermissionAndGroupRequiredMixin(PermissionRequiredMixin):
  permission_required = None
  group_required = None

  def has_permission(self):
    if self.permission_required is None and self.group_required is None:
      return True
    user_permissions = self.request.user.get_all_permissions()
    user_groups = self.request.user.groups.all()
    has_permission = self.permission_required in user_permissions if self.permission_required else True
    has_group = any(group.name == self.group_required for group in user_groups) if self.group_required else True
    return has_permission and has_group
  
  def handle_no_permission(self):
      messages.error(self.request, '¡No tienes permisos para acceder a la vista solicitada, comunicate con el administrador del sistema!')
      return HttpResponseRedirect('/dashboard/')