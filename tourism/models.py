from django.db import models

# Create your models here.
class CarouselItem(models.Model):
    MEDIA_TYPE = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE)
    file = models.FileField(upload_to='carousel/')      # фото или видео
    title = models.CharField(max_length=200, blank=True) # пусто для видео
    button_text = models.CharField(max_length=50, blank=True)  # пусто для видео
    button_link = models.CharField(max_length=200, blank=True) # куда ведёт кнопка
    order = models.PositiveIntegerField(default=0)      # порядок слайдов
    interval = models.PositiveIntegerField(default=5000) # 52000 для видео, 5000 для фото

    class Meta:
        ordering = ['order']  # сортировка по порядку
        verbose_name = 'Carousel Item'
        verbose_name_plural = 'Carousel (Home)'  # ← меняй на что хочешь

    def __str__(self):
        return f"{self.media_type} - {self.title or 'Video slide'}"



def attraction_upload_path(instance, filename):
    return f'attractions/{instance.tab}/{filename}'

class Attraction(models.Model):
    
    TAB_CHOICES = [
        ('highlights', 'Highlights'),
        ('cities', 'Cities'),
        ('unesco', 'UNESCO Heritage'),
        ('culture', 'Culture'),
        ('regions', 'Regions'),
        ('culinary', 'Culinary'),
    ]

    BADGE_CHOICES = [
        ('city', 'City'),
        ('nature', 'Nature'),
        ('unesco', 'UNESCO'),
        ('sport', 'Sport'),
        ('relax-and-wellness', 'Relax and Wellness'),
        ('culture', 'Culture'),
        ('culinary', 'Culinary'),
        ('region', 'Region'),
    ]

    SIZE_CHOICES = [
        ('card-tall', 'Tall'),
        ('card-almost-tall', 'Almost Tall'),
        ('card-short', 'Short'),
    ]

    COLUMN_CHOICES = [
        (1, 'Column 1'),
        (2, 'Column 2'),
        (3, 'Column 3'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to=attraction_upload_path)
    tab = models.CharField(max_length=20, choices=TAB_CHOICES)
    badge = models.CharField(max_length=30, choices=BADGE_CHOICES)
    card_size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='card-short')
    column = models.IntegerField(choices=COLUMN_CHOICES, default=1)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['column', 'order']
        verbose_name = 'Attraction'
        verbose_name_plural = 'Get Insipred (Home)'  # ← меняй на что хочешь

    def __str__(self):
        return f"{self.name} ({self.tab})"