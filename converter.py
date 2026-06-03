def celsius_to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32


def fahrenheit_to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5 / 9


def main():
    print("温度转换器")
    print("1. 摄氏度转华氏度")
    print("2. 华氏度转摄氏度")

    choice = input("请选择功能（1/2）：").strip()

    if choice == "1":
        celsius = float(input("请输入摄氏度："))
        fahrenheit = celsius_to_fahrenheit(celsius)
        print(f"{celsius:.2f} 摄氏度 = {fahrenheit:.2f} 华氏度")
    elif choice == "2":
        fahrenheit = float(input("请输入华氏度："))
        celsius = fahrenheit_to_celsius(fahrenheit)
        print(f"{fahrenheit:.2f} 华氏度 = {celsius:.2f} 摄氏度")
    else:
        print("无效选择，请输入 1 或 2。")


if __name__ == "__main__":
    main()
