from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'blog/index.html')

def where_to_go(request):
    return render(request, 'blog/where_to_go.html')

def things_to_do(request):
    return render(request, 'blog/things_to_do.html')

def plan_your_trip(request):
    return render(request, 'blog/plan_your_trip.html')

def information(request):
    return render(request, 'blog/information.html')   