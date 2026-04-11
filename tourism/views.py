from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from .forms import RegistrationForm
from .models import CarouselItem, Attraction


def index(request):
    carousel_items = CarouselItem.objects.all()
    
    # TABS
    see_all_labels = {
        'cities': 'See all cities',
        'unesco': 'See all heritages',
        'culture': 'See all culture',
        'regions': 'See all regions',
        'culinary': 'See all culinary',
    }
  
    tabs = ['highlights', 'cities', 'unesco', 'culture', 'regions', 'culinary']
    attractions = {}
    for tab in tabs:
        items = Attraction.objects.filter(tab=tab)
        # Group by columns
        attractions[tab] = {
            'col1': items.filter(column=1),
            'col2': items.filter(column=2),
            'col3': items.filter(column=3),
            'see_all': see_all_labels.get(tab, f'See all {tab}'),
        }

    return render(request, 'blog/index.html', {
        'carousel_items': carousel_items,
        'attractions': attractions,
    })


def plan_your_trip(request):
    return render(request, 'blog/plan_your_trip.html')

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Data from form
            email = form.cleaned_data['email']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            password = form.cleaned_data['password']

            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            # Automaticly log user
            login(request, user)

            return redirect('registration_success')
    else:
        form = RegistrationForm()

    return render(request, 'blog/registration_form.html', {'form': form})
