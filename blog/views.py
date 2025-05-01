from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'blog/index.html')

def plan_your_trip(request):
    return render(request, 'blog/plan_your_trip.html')
