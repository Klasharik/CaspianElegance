from django.contrib import admin
from .models import CarouselItem, Tab, Attraction, AttractionTab, Badge, Tour

@admin.register(CarouselItem)
class CarouselItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'media_type', 'title', 'interval']
    list_display_links = ['title']
    list_editable = ['order']

@admin.register(Tab)
class TabAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'show_see_all', 'see_all_text', 'order']
    list_display_links = ['name']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color']
    list_display_links = ['name']
    prepopulated_fields = {'slug': ('name',)}

class AttractionTabInline(admin.TabularInline):
    model = AttractionTab
    extra = 1
    fields = ['tab', 'column', 'order']


@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    inlines = [AttractionTabInline]
    list_display = ['name', 'get_tabs', 'badge', 'card_size']
    list_editable = ['card_size']
    list_display_links = ['name']
    list_filter = ['tabs']

    def get_tabs(self, obj):
        return ", ".join([t.name for t in obj.tabs.all()])
    get_tabs.short_description = 'Tabs'

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ['title', 'nights', 'price', 'order', 'is_active']
    list_display_links = ['title']
    list_editable = ['order', 'is_active']