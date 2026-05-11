from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import CarouselItem, Attraction, Tab, Tour, Favourite

def index(request):
    carousel_items = CarouselItem.objects.all()
    tabs = Tab.objects.prefetch_related('attractions').all()
    tours = Tour.objects.filter(is_active=True)

    favourite_tour_ids = []
    favourite_attraction_ids = []
    if request.user.is_authenticated:
        favourite_tour_ids = list(
            Favourite.objects.filter(user=request.user, tour__isnull=False)
            .values_list('tour_id', flat=True)
        )
        favourite_attraction_ids = list(
            Favourite.objects.filter(user=request.user, attraction__isnull=False)
            .values_list('attraction_id', flat=True)
        )

    attractions = {}
    for tab in tabs:
        items = tab.attractions.all()
        attractions[tab.slug] = {
            'tab': tab,
            'col1': items.filter(column=1),
            'col2': items.filter(column=2),
            'col3': items.filter(column=3),
        }

    return render(request, 'blog/index.html', {
        'carousel_items': carousel_items,
        'tabs': tabs,
        'attractions': attractions,
        'tours': tours,
        'favourite_tour_ids': favourite_tour_ids,
        'favourite_attraction_ids': favourite_attraction_ids,
    })

def plan_your_trip(request):
    return render(request, 'blog/plan_your_trip.html')



@login_required
def profile(request):
    return render(request, 'blog/profile.html', {
        'user': request.user,
    })

@login_required
def favourites(request):
    favs = Favourite.objects.filter(user=request.user).select_related('attraction', 'tour')
    return render(request, 'blog/favourites.html', {
        'favourites': favs,
    })

@login_required
@require_POST
def toggle_favourite(request, item_type, item_id):
    if item_type == 'attraction':
        fav, created = Favourite.objects.get_or_create(
            user=request.user,
            attraction_id=item_id,
        )
    elif item_type == 'tour':
        fav, created = Favourite.objects.get_or_create(
            user=request.user,
            tour_id=item_id,
        )
    else:
        return JsonResponse({'error': 'Invalid type'}, status=400)

    if not created:
        fav.delete()
        return JsonResponse({'status': 'removed'})

    return JsonResponse({'status': 'added'})

