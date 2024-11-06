from django.forms import *
from django.contrib.auth.models import User, Group, Permission

class UserEditForm(ModelForm):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

  class Meta:
    model=User
    fields= ('date_joined','last_login','first_name','last_name','email','groups','is_superuser','is_staff','is_active',)
    widgets={
      'first_name' : TextInput(
        attrs={
          'id':'first_name',
          'class':'form-control',
        }
      ),
      'last_name' : TextInput(
        attrs={
          'id':'last_name',
          'class':'form-control',
        }
      ),
      'email' : TextInput(
        attrs={
          'id':'email',
          'type':'email',
          'class':'form-control',
        }
      ),
      'groups' : Select(
        attrs={
          'id':'id_groups',
          'class':'form-control select2'
        }
      ),
      'is_superuser' : CheckboxInput(
        attrs={
          'id':'id_superuser',
          'class':'form-control',
        }
      ),
      'is_staff' : CheckboxInput(
        attrs={
          'id':'is_staff',
          'class':'form-control',
        }
      ),
      'is_active' : CheckboxInput(
        attrs={
          'id':'is_active',
          'class':'form-control',
        }
      ),
      'date_joined' : DateInput(
        attrs={
          'id':'date_joined',
          'class':'form-control form-control-border',
          'readonly':'readonly'
        }
      ),
      'last_login' : DateInput(
        attrs={
          'id':'last_login',
          'class':'form-control form-control-border',
          'readonly':'readonly'
        }
      ),
    }

class GroupForm(ModelForm):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
  class Meta:
    model=Group
    fields='__all__'
    # exclude= ('permissions',)
    
    widgets={
      'name' : TextInput(
        attrs={
          'id':'name',
          'class':'form-control',
        }
      ),
    }