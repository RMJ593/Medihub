from django.contrib import admin
from account.models import Person,Team
# Register your models here.
admin.site.register(Team)
admin.site.register(Person)