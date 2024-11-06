from django.db import models
from django.utils import timezone

class Type(models.Model):
  name=models.CharField(max_length=45,verbose_name='Nombre',unique=True)
    
  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'type'
    managed = True
    verbose_name = 'Tipo'
    verbose_name_plural = 'Tipos'

class Status(models.Model):
  name=models.CharField(max_length=45,verbose_name='Nombre')
  description=models.CharField(max_length=60,verbose_name='Descripción')
  type=models.ForeignKey(Type,on_delete=models.PROTECT,verbose_name='Tipo')

  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'status'
    managed = True
    verbose_name = 'Estado'
    verbose_name_plural = 'Estados'

class Village(models.Model):
  name=models.CharField(max_length=75,verbose_name='Nombre')

  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'village'
    managed = True
    verbose_name = 'Aldea'
    verbose_name_plural = 'Aldeas'

class Section(models.Model):
  name=models.CharField(max_length=75,verbose_name='Nombre')
  village=models.ForeignKey(Village,on_delete=models.PROTECT,verbose_name='Aldea')

  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'section'
    managed = True
    verbose_name = 'Sector'
    verbose_name_plural = 'Sectores'

class Owner(models.Model):
  GENDER_OPTION = {
   "F":"FEMENINO",
   "M":"MASCULINO",
  }
  dpi=models.CharField(max_length=13,verbose_name='DPI',unique=True)
  first_name=models.CharField(max_length=75,verbose_name='Nombres')
  last_name=models.CharField(max_length=75,verbose_name='Apellidos')
  birthdate=models.DateField(verbose_name='Fecha de nacimiento')
  gender=models.CharField(max_length=1, choices=GENDER_OPTION,verbose_name='Género')
  phone=models.CharField(max_length=8,verbose_name='Celular')
  status=models.ForeignKey(Status,default=22,on_delete=models.PROTECT,verbose_name='Estado')
  
  class Meta:
    db_table = 'owner'
    managed = True
    verbose_name = 'Propietario'
    verbose_name_plural = 'Propietarios'
  
  def __str__(self) -> str:
    return "{} - {}{}".format(self.dpi,self.first_name, self.last_name)

class Mark(models.Model):
  name=models.CharField(max_length=75,verbose_name='Nombre')

  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'mark'
    managed = True
    verbose_name = 'Marca'
    verbose_name_plural = 'Marcas'

class Meter(models.Model):
  number=models.CharField(max_length=15,verbose_name='Número')
  serie=models.CharField(max_length=45,verbose_name='Serie')
  mark=models.ForeignKey(Mark,on_delete=models.PROTECT,verbose_name='Marca')

  def __str__(self) -> str:
    return self.name

  class Meta:
    db_table = 'meter'
    managed = True
    verbose_name = 'Contador'
    verbose_name_plural = 'Contadores'

class Service(models.Model):
  address=models.CharField(max_length=250,verbose_name='Dirección')
  owner=models.ForeignKey(Owner,on_delete=models.PROTECT,verbose_name='Propietario')
  meter=models.ForeignKey(Meter,on_delete=models.PROTECT,verbose_name='Contador')
  section=models.ForeignKey(Section,on_delete=models.PROTECT,verbose_name='Sector')

  def __str__(self) -> str:
    return f"{self.owner.first_name}-{self.meter.number}"

  class Meta:
    db_table = 'service'
    managed = True
    verbose_name = 'Servicio'
    verbose_name_plural = 'Servicios'

class ServiceDetail(models.Model):
  date=models.DateField(default=timezone.now,verbose_name='Fecha')
  reading=models.CharField(max_length=5,verbose_name='Lectura')
  diference=models.CharField(max_length=5,verbose_name='Diferencia')
  excess=models.CharField(max_length=3,verbose_name='Exceso')
  total=models.FloatField(verbose_name='Total a pagar')
  debt=models.FloatField(verbose_name='Mora')
  service=models.ForeignKey(Service,on_delete=models.PROTECT,verbose_name='Servicio')

  def __str__(self) -> str:
    return f"{self.date}-{self.total}"

  class Meta:
    db_table = 'service_detail'
    managed = True
    verbose_name = 'Detalle de servicio'
    verbose_name_plural = 'Detalles de servicios'