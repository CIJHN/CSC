//
// Created by Hongze Xu on 10/11/2016.
//

#ifndef CPRACTICE_SCANNINGDEVICE_H
#define CPRACTICE_SCANNINGDEVICE_H

/**
 * The maximum id of the product.
 */
static const int MAX_PRODUCT_ID = 256;

/**
 * The class that handles the device check in/out in factory.
 */
class ScanningDevice {
private:
    int count;
    unsigned char types;
    int *products;

public:
    /**
     * The public constructor
     */
    ScanningDevice();

    ~ScanningDevice();

    /**
     * Check in a product by its id.
     *
     * @param productId The product's id.
     * @return If this check in action is successed.
     */
    bool checkIn(int productId);

    /**
     * Check out a product by its id.
     *
     * @param productId The product's id.
     * @return If this check out action is successed.
     */
    bool checkOut(int productId);

    /**
     * Get the number of the products that are already been checked in by product's id.
     *
     * @param productId The product's id.
     * @return The number of products.
     */
    int numberOfProducts(int productId);

    /**
    * Get the number of types of the products that checked in.
    *
    * @return The number of products.
    */
    int numberOfExistingProductTypes();

    /**
    * Get the count of total products checked in.
    *
    * @return The total number of products.
    */
    int totalNumberOfProducts();
};


#endif //CPRACTICE_SCANNINGDEVICE_H
