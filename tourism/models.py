from django.db import models
from django.conf import settings
from colorfield.fields import ColorField

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
        ordering = ['order']  # sort by order
        verbose_name = 'Carousel Item'
        verbose_name_plural = 'Carousel (Home)'  # name change

    def __str__(self):
        return f"{self.media_type} - {self.title or 'Video slide'}"

class Tab(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    show_see_all = models.BooleanField(default=True)
    see_all_text = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Tab'
        verbose_name_plural = 'Tabs (Get Inspired/Home)'

    def __str__(self):
        return self.name

class Badge(models.Model):
    name = models.CharField(max_length=100) 
    slug = models.SlugField(unique=True)
    color = ColorField(default='#5d646b')

    class Meta:
        verbose_name = 'Badge'
        verbose_name_plural = 'Badges (Get Inspired/Home)'

    def __str__(self):
        return self.name

from django.utils.text import slugify

def attraction_upload_path(instance, filename):
    return f'attractions/{slugify(instance.name)}/{filename}'

class Attraction(models.Model):
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
    tabs = models.ManyToManyField(Tab, through='AttractionTab', related_name='attractions')
    badge = models.ForeignKey(Badge, on_delete=models.SET_NULL, null=True, related_name='attractions')
    card_size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='card-short')

    class Meta:
        verbose_name = 'Attraction'
        verbose_name_plural = 'Get Inspired (Home)'

    def __str__(self):
        return self.name

class AttractionTab(models.Model):
    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE)
    tab = models.ForeignKey(Tab, on_delete=models.CASCADE)
    column = models.IntegerField(choices=Attraction.COLUMN_CHOICES, default=1)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['column', 'order']
        unique_together = ['attraction', 'tab']

    def __str__(self):
        return f"{self.attraction.name} → {self.tab.name}"

class Tour(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=300)
    image = models.ImageField(upload_to='tours/')
    nights = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=0)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Tour'
        verbose_name_plural = 'Tours (Home)'

    def __str__(self):
        return self.title

    @property
    def short_title(self):
        return self.title.split('—')[0].strip()

    @property
    def short_discription(self):
        return self.title.split('—')[1].strip()

class Favourite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favourites'
    )
    attraction = models.ForeignKey(
        Attraction,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='favourited_by'
    )
    tour = models.ForeignKey(
        Tour,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='favourited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Favourites'
        ordering = ['created_at']
        constraints = [
            models.UniqueConstraint(fields=['user', 'attraction'], name='unique_user_attraction_favourite'),
            models.UniqueConstraint(fields=['user', 'tour'], name='unique_user_tour_favourite'),
            models.CheckConstraint(
                check=(
                    (models.Q(attraction__isnull=False) & models.Q(tour__isnull=True)) |
                    (models.Q(attraction__isnull=True) & models.Q(tour__isnull=False))
                ),
                name='favourite_exactly_one_item'
            ),
        ]

    def __str__(self):
        item = self.attraction or self.tour
        return f"{self.user.email} → {item}"
