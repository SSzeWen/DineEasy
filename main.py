import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
from listSearch import get_links
from web import get_reviews
import concurrent.futures

start = time.time()
google_links = [
                'https://www.google.com/maps/search/Restaurants/@1.3262545,103.848989,16z/data=!3m1!4b1!4m2!2m1!6e5',
                'https://www.google.com/maps/search/Restaurants/@1.4318091,103.8141164,16z/data=!3m1!4b1'
                ]
# To scrape https://www.google.com/maps/search/Restaurants/@1.3328409,103.9400363,14z/data=!3m1!4b1!4m2!2m1!6e5
# https://www.google.com/maps/search/Restaurants/@1.3734444,103.8490616,14z/data=!3m1!4b1!4m2!2m1!6e5
# https://www.google.com/maps/search/Restaurants/@1.3262545,103.848989,16z/data=!3m1!4b1!4m2!2m1!6e5
# https://www.google.com/maps/search/Restaurants/@1.4318091,103.8141164,16z/data=!3m1!4b1
rest_links = []

for link in google_links:
    rest_links += (get_links(link, 9))

pd.set_option("display.max_rows", None, "display.max_columns", None)

print(len(rest_links))

rest_links = list(set(rest_links))

print(len(rest_links))

reviews = pd.DataFrame({'Review Rate': [],
        'Review Text' : []}) 
rev_dict = {'Review Rate': [],
        'Review Text' : []}

def add(url):
    dict = get_reviews(url)
    for item in dict['Review Rate']:
        rev_dict['Review Rate'].append(item)
    for item in dict['Review Text']:
        rev_dict['Review Text'].append(item)

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    executor.map(add, rest_links)

reviews = pd.DataFrame(rev_dict)
reviews = reviews.reset_index(drop=True)
reviews.to_csv('reviewsp3.csv')
print(len(reviews))
print(reviews)
end = time.time()
hours, rem = divmod(end-start, 3600)
minutes, seconds = divmod(rem, 60)
print("{:0>2}:{:0>2}:{:05.2f}".format(int(hours),int(minutes),seconds))


