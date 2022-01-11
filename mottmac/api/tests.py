from django.test import TestCase

# Create your tests here.

def intervalMultiply(ab,cd):
    # Interval Arithmetic: https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node45.html
    # [a,b]*[c,d] = [min(ac,ad,bc,bd), max(ac,ad,bc,bd)]
    
    values = []
    for i in range(2):
        for j in range(2):
            values.append(ab[i]*cd[j])
    
    prod = [min(values), max(values)]
    return prod

print(intervalMultiply([1119.69, 1866.15],[0.10,0.15]))
print(intervalMultiply([508.29, 847.15],[0.10,0.15]))

print([x*0.415744703875402*134/1000 for x in intervalMultiply([1119.69, 1866.15],[0.10,0.15])])
print([x*0.7769657804130661*134/1000 for x in intervalMultiply([508.29, 847.15],[0.10,0.15])])

