from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from .models import CarouselItem, Attraction, AttractionTab, Tab, Tour, Favourite

def index(request):
    carousel_items = CarouselItem.objects.all()
    tabs = Tab.objects.prefetch_related(
        'attractions',
        'attractions__attractiontab_set'
    ).all()
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
        tab_items = AttractionTab.objects.filter(tab=tab).select_related('attraction', 'attraction__badge')
        attractions[tab.slug] = {
            'tab': tab,
            'col1': tab_items.filter(column=1).order_by('order'),
            'col2': tab_items.filter(column=2).order_by('order'),
            'col3': tab_items.filter(column=3).order_by('order'),
        }

    return render(request, 'blog/index.html', {
        'carousel_items': carousel_items,
        'tabs': tabs,
        'attractions': attractions,
        'tours': tours,
        'favourite_attraction_ids': favourite_attraction_ids,
        'favourite_tour_ids': favourite_tour_ids,
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
        session_key = f'fav_created_at_{item_type}_{item_id}'
        request.session[session_key] = fav.created_at.isoformat()
        fav.delete()
        return JsonResponse({'status': 'removed'})
    
    session_key = f'fav_created_at_{item_type}_{item_id}'
    saved_created_at = request.session.pop(session_key, None)

    if saved_created_at:
        # Восстанавливаем старую позицию — обновляем created_at напрямую
        # (auto_now_add нельзя изменить через save(), поэтому используем update())
        Favourite.objects.filter(pk=fav.pk).update(
            created_at=saved_created_at
        )

    return JsonResponse({'status': 'added'})

