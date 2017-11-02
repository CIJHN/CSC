//
// Created by Hongze Xu on 10/11/2016.
//

#include <cstdlib>
#include "ScanningDevice.h"

inline bool validate(int &productId) {
    return productId >= 0 && productId < ScanningDevice::MAX_PRODUCT_ID;
}

bool ScanningDevice::checkIn(int productId) {
    if (!validate(productId))
        return false;
    if (++products[productId] == 1)++types;
    ++count;
    return true;
}

bool ScanningDevice::checkOut(int productId) {
    if (!validate(productId) || products[productId] <= 0)
        return false;
    if (--products[productId] == 0)--types;
    --count;
    return true;
}

int ScanningDevice::numberOfProducts(int productId) {
    return products[productId];
}

int ScanningDevice::numberOfExistingProductTypes() {
    return types;
}

int ScanningDevice::totalNumberOfProducts() {
    return count;
}

ScanningDevice::ScanningDevice() {
    products = (int *) calloc(MAX_PRODUCT_ID, sizeof(int));
    count = 0;
    types = 0;
}

ScanningDevice::~ScanningDevice() {
    delete[] products;
}
