from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import pandas as pd    

def get_reviews(address):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    #London Victoria & Albert Museum URL
    driver.get(address)

    #driver.find_element(By.XPATH,'//*[@id="yDmH0d"]/c-wiz/div/div/div/div[2]/div[1]/div[4]/form/div[1]/div/button').click()
    #to make sure content is fully loaded we can use time.sleep() after navigating to each page
    import time
    time.sleep(5)


    #Find the total number of reviews
    #total_number_of_reviews = driver.find_element_by_xpath('//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[58]/div/button').text.split(" ")[0]
    try:
        #add in wait
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'HHrUdb')))
        total_number_of_reviews = driver.find_element_by_class_name('HHrUdb')
        print(total_number_of_reviews.get_attribute('innerHTML').strip())
    except:
        print('webpage not found')
        pass

    #total_number_of_reviews = int(total_number_of_reviews.replace(',','')) if ',' in total_number_of_reviews else int(total_number_of_reviews)
    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CSS_SELECTOR, "[jsaction='pane.reviewlist.goToReviews']")))
        element = driver.find_element_by_css_selector("[jsaction='pane.reviewlist.goToReviews']")
        driver.implicitly_wait(20)
        element.click()
    except:
        print('button not found')
        pass
    
    time.sleep(2)

    #driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")


    #last_div = driver.find_elements_by_css_selector("[jsan='t-h6_M4FDMGww,7.qCHGyb,5.height,0.role']")
    #ActionChains(driver).move_to_element(last_div[-1]).perform()
    n = 0
    while n < 100:
        try:
            last_div = driver.find_element_by_css_selector("[jsan='t-WPtQSFf6msE,7.lXJj5c,7.Hk4XGb']")
            ActionChains(driver).move_to_element(last_div).perform()
            n+=1
        except: 
            break
    time.sleep(4)
    response = BeautifulSoup(driver.page_source, 'html.parser')
    reviews = response.find_all('div', class_='jftiEf')
    driver.quit()
    return get_review_summary(reviews)

def get_review_summary(result_set):
    num = 1
    rev_dict = {'Review Rate': [],
        'Review Text' : []}
    for result in result_set:
        review_rate = result.find('span', class_='kvMYJc')["aria-label"]
        review_text = result.find('span',class_='wiI7pd').text
        if review_text == "":
            break
        rev_dict['Review Rate'].append(review_rate)
        rev_dict['Review Text'].append(review_text)
        print(str(num) + " reviews added")
        num +=1
    
    return rev_dict
