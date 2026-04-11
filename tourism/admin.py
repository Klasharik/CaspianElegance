from django.contrib import admin
from .models import CarouselItem, Attraction

@admin.register(CarouselItem)
class CarouselItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'media_type', 'title', 'interval']
    list_display_links = ['title']
    list_editable = ['order']


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ['name', 'tab', 'badge', 'card_size', 'column', 'order']
    list_editable = ['order', 'column', 'card_size']
    list_display_links = ['name']
    list_filter = ['tab']
